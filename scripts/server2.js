// const fs = require('fs')
const http = require('http')
const path = require('path')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const express = require('express')
const chalk = require('chalk')
const cp = require('child_process')
const swaggerUi = require('swagger-ui-express')
const swaggerDocumentMain = require('../public/documentation/pages/swaggers/swaggerMain.json')
const setups = require('../API/setups')
const { sequelize } = require('../API/connection')
const testEnv = require('../API/testEnv')
const logger = require('../API/logger')
const { websocket } = require('../API/websocket')
const { middleware } = require('./middleware')

const isProdEnv = true || process.env.NODE_ENV === 'production'
const isDevEnv = process.env.NODE_ENV === 'development' || !isProdEnv
const ROOT_PATH = isDevEnv ? '' : process.env.ROOT_PATH || ''
const rootDir = path.join(__dirname, '..')

const app = express()
const guestUsername = 'guest'

// This is application-level middleware, written to run for all requests.
const cssoHandler = (req, res, next) => {
  console.log('New request: ' + req.originalUrl)
  // For this application, every HTTP request is a direct response to user
  // activity, so we can set the activity header to true on every response.
  res.set('X-Activity', 'true')

  // Also hardcoded a few places on the front-end and maybe initial Lead file creation
  req.leadGroupName = 'mmgis-group'

  // Get the user's and username information from the request headers and set
  // them as attributes of the req object.

  // if (process.env.AUTH === 'csso') {
  //   if (req.get('X-Groups') !== undefined) {
  //     req.groups = JSON.parse(
  //       Buffer.from(req.get('X-Groups'), 'base64').toString('ascii')
  //     )
  //     if (req.groups[process.env.CSSO_LEAD_GROUP] === true) {
  //       req.groups[req.leadGroupName] = true
  //     }
  //     req.user = req.get('X-Sub')
  //     req.session.user = req.user
  //     const cssoSessionID = req.get('X-Session')
  //     if (cssoSessionID) req.cssoSessionID = cssoSessionID
  //   }
  // } else {
  //   req.user = req.session.user || guestUsername
  //   const leads = process.env.LEADS ? JSON.parse(process.env.LEADS) : []
  //   if (leads.indexOf(req.user) !== -1) {
  //     req.groups = {}
  //     req.groups[req.leadGroupName] = true
  //   } else {
  //     req.groups = {}
  //   }
  // }

  console.log('User: ' + req.user)
  next()
}

// Prepare
const rateLimit = require('express-rate-limit')
const apilimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20000 // limit each IP to 100 requests per windowMs
})
const APIlimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 20000 // limit each IP to 100 requests per windowMs
})

// Load the permissions.json file, which maps LDAP groups to permission sets.
// This application has two permission sets: "users" and "admins".
const permissions = {}
permissions.users = process.env.CSSO_GROUPS
  ? JSON.parse(process.env.CSSO_GROUPS)
  : []

// The port your application runs on must only be exposed locally. The CSSO
// proxy will run on a different port, which will be exposed externally.
const port = parseInt(process.env.PORT || '8889', 10)

/** set the session for application */
const cookieOptions = { maxAge: 86400000 }
if (process.env.THIRD_PARTY_COOKIES === 'true') {
  cookieOptions.sameSite = 'None'
  if (isProdEnv) cookieOptions.secure = true
}

const { Pool } = require('pg')
const session = require('express-session')
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || '5432'
})
app.use(
  session({
    secret: process.env.SECRET || 'Shhhh, it is a secret!',
    name: 'MMGISSession',
    proxy: true,
    resave: false,
    cookie: cookieOptions,
    saveUninitialized: false,
    store: new (require('connect-pg-simple')(session))({
      pool
    })
  })
)

// Security
function setContentType (req, res, next) {
  res.setHeader('Content-Type', 'application/json')
  next()
}
function checkHeadersCodeInjection (req, res, next) {
  const injectionWords = [
    'pass',
    'pw',
    'password',
    'delete',
    'insert',
    'select',
    'disable',
    'enable',
    'drop',
    'set',
    'script',
    '<script>'
  ]

  let codeInjected = false

  // Get the whole requested link from users
  const fullUrl = req.protocol + '://' + req.get('host') + '/apis' + req.url
  const lowerURL = fullUrl.toLowerCase()

  for (const w in injectionWords) {
    if (lowerURL.includes(injectionWords[w])) {
      codeInjected = true
    }
  }

  if (codeInjected) {
    res.send({
      Warning:
        'You are not allowed to inject bad code to the application. Your action will be reported!',
      'Your IP': req.headers['x-forwarded-for'] || req.connection.remoteAddress,
      'Requested URL': fullUrl
    })
    res.end()
  } else {
    // Set header parameters for this request
    // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:80');
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    // res.setHeader('Content-Type', 'application/json');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-with, Content-Type, Methods'
    )
    next()
  }
}

function stopGuests (req, res, next) {
  const url = req.originalUrl.split('?')[0].toLowerCase()

  if (
    url.endsWith('/api/configure/get') ||
    url.endsWith('/api/configure/missions') ||
    url.endsWith('/api/files/getfile')
  ) {
    next()
    return
  }

  if (req.user === guestUsername || process.env.AUTH === 'off') {
    res.send({ status: 'failure', message: 'User is not logged in.' })
    res.end()
  } else next()
}

/**
 * ensureGroup - Checks if user is in ANY of the allowed groups.
 *
 * Returns an Express/Connect middleware function that calls the next handler
 * if the user is authorized, and sends a 403 Forbidden error message if not.
 *
 * @param {array} allowedGroups - An array of group names.
 * @return {function}
 */
function ensureGroup (allowedGroups) {
  return (req, res, next) => {
    // req.groups is an object, set by cssoHandler (which runs on every
    // request), where each key is a group and each value is a boolean
    // indicating if the user is in that group. For each allowed group, this
    // will check if the group is present in req.groups, and if the value for
    // that group is True. If that is the case, continue to the next handler,
    // otherwise continue checking the list of allowed groups. If the user is
    // not in any allowed groups, the next handler will never be called and a
    // 403 Forbidden response will be returned to the user.
    // console.log( 'ensureGroup', req );
    if (process.env.AUTH !== 'csso') {
      next()
      return
    }

    if (req.groups !== undefined) {
      for (const group of allowedGroups) {
        if (Object.keys(req.groups).indexOf(group) !== -1 && req.groups[group]) {
          next()
          return
        } else if (isDevEnv) {
          next()
          return
        }
      }
    } else if (isDevEnv) {
      next()
      return
    }

    res.render('unauthorized', { user: req.user })
  }
}

function ensureAdmin (toLoginPage, denyLongTermTokens) {
  return (req, res, next) => {
    const url = req.originalUrl.split('?')[0].toLowerCase()
    const remoteAddress =
      req.headers['x-forwarded-for'] || req.connection.remoteAddress

    if (
      url.endsWith('/api/configure/get') ||
      url.endsWith('/api/configure/missions') ||
      url.endsWith('/api/geodatasets/get') ||
      url.endsWith('/api/geodatasets/search') ||
      url.endsWith('/api/datasets/get') ||
      req.session.permission === '111'
    ) { next() } else if (toLoginPage) res.render('adminlogin', { user: req.user })
    else if (!denyLongTermTokens && req.headers.authorization) {
      validateLongTermToken(
        req.headers.authorization,
        () => {
          req.isLongTermToken = true
          next()
        },
        () => {
          res.send({ status: 'failure', message: 'Unauthorized Token!' })
          logger(
            'warn',
            `Unauthorized token call made and rejected (from ${remoteAddress}, with token ${req.headers.authorization})`,
            req.originalUrl,
            req
          )
        }
      )
    } else {
      res.send({ status: 'failure', message: 'Unauthorized!' })
      logger(
        'warn',
        `Unauthorized call made and rejected (from ${remoteAddress})`,
        req.originalUrl,
        req
      )
    }
  }
}

function validateLongTermToken (token, successCallback, failureCallback) {
  token = token.replace('Bearer ', '')

  sequelize
    .query('SELECT * FROM "long_term_tokens" WHERE "token"=:token', {
      replacements: {
        token
      }
    })
    .then((result) => {
      try {
        result = result[0][0]
      } catch (err) {
        failureCallback()
      }

      if (
        result &&
        result.token === token &&
        (result.period === 'never' ||
          Date.now() - new Date(result.createdAt).getTime() <
          parseInt(result.period))
      ) {
        successCallback(result)
      } else {
        failureCallback()
      }
    })
}

function ensureUser () {
  return (req, res, next) => {
    if (
      process.env.AUTH !== 'local' ||
      (typeof req.session.permission === 'string' &&
        req.session.permission[req.session.permission.length - 1] === '1')
    ) {
      next()
    } else {
      if (req.headers.authorization) {
        const remoteAddress =
          req.headers['x-forwarded-for'] || req.connection.remoteAddress
        validateLongTermToken(
          req.headers.authorization,
          () => {
            req.isLongTermToken = true
            next()
          },
          () => {
            res.send({ status: 'failure', message: 'Unauthorized Token!' })
            logger(
              'warn',
              `Unauthorized token call made and rejected (from ${remoteAddress}, with token ${req.headers.authorization})`,
              req.originalUrl,
              req
            )
          }
        )
      } else {
        res.render('login', {
          user: req.user,
          CLEARANCE_NUMBER: process.env.CLEARANCE_NUMBER || 'CL##-####'
        })
      }
    }
  }
}

const swaggerOptions = {
  customCssUrl: '/documentation/pages/swaggers/swaggerCSS.css',
  customJs: '/documentation/pages/swaggers/swaggerJS.js'
}

const useSwaggerSchema =
  (schema) =>
    (...args) =>
      swaggerUi.setup(schema, swaggerOptions)(...args)

const s = {
  app,
  cssoHandler,
  setContentType,
  checkHeadersCodeInjection,
  stopGuests,
  ensureGroup,
  ensureAdmin,
  ensureUser,
  swaggerUi,
  useSwaggerSchema,
  permissions,
  ROOT_PATH
}

// Trust first proxy
app.set('trust proxy', 1)

app.use('/api/', apilimiter)
app.use('/API/', APIlimiter)

// gzip!!
const compression = require('compression')
app.use(compression({ filter: shouldCompress }))
function shouldCompress (req, res) {
  // Disable compression of images since they're already compressed
  if (
    req.headers['content-type'] &&
    req.headers['content-type'].indexOf('image') !== -1
  ) {
    return false
  }

  // fallback to standard filter function
  return compression.filter(req, res)
}

/***********************************************************
 * This part is for setting up the express framework and its
 * configuration for having more security
 **********************************************************/
const helmet = require('helmet')
const helmetConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", 'blob:', "'unsafe-inline'", "'unsafe-eval'"],
      imgSrc: ['*', 'data:', 'blob:', "'unsafe-inline'"],
      styleSrc: ['*', 'data:', 'blob:', "'unsafe-inline'"],
      fontSrc: ['*', 'data:', 'blob:', "'unsafe-inline'"],
      connectSrc: ['*'],
      frameAncestors: process.env.FRAME_ANCESTORS
        ? JSON.parse(process.env.FRAME_ANCESTORS)
        : 'none',
      frameSrc: process.env.FRAME_SRC
        ? JSON.parse(process.env.FRAME_SRC)
        : 'none'
    }
  }
}

app.use(helmet(helmetConfig))

app.set('etag', false)
app.disable('x-powered-by')
app.disable('Origin')

app.use(
  `${ROOT_PATH}/api/docs/main`,
  swaggerUi.serve,
  useSwaggerSchema(swaggerDocumentMain)
)

// Pug is used to render pages.
app.set('view engine', 'pug')

// Ensure the CSSO handler runs on every request.
app.use(cssoHandler)

// app.use(logger('dev'));
// app.use(express.json());

app.use(bodyParser.json({ limit: '500mb' })) // support json encoded bodies
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true })) // support encoded bodies

app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

const cors = require('cors')
app.use(cors())
// app.set('Origin', false);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next() // next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

/* Require all dynamic backend setup scripts
and return functions that bulk run their functions
*/
setups.getBackendSetups(function (setups) {
  // Sync all tables
  sequelize
    .sync()
    .then(() => {
      logger(
        'success',
        'All needed tables exist or have been successfully created!',
        'server'
      )

      /// ///Setups SYNC//////
      setups.synced(s)

      return null
    })
    .catch((error) =>
      logger(
        'infrastructure_error',
        'Database tables might not be synced properly! ' + error,
        'server'
      )
    )

  // STATICS

  app.use(
    `${ROOT_PATH}/build`,
    ensureUser(),
    express.static(path.join(rootDir, '/build'))
  )
  app.use(
    `${ROOT_PATH}/documentation`,
    express.static(path.join(rootDir, '/public/documentation'))
  )
  app.use(
    `${ROOT_PATH}/docs/helps`,
    express.static(path.join(rootDir, '/docs/helps'))
  )
  app.use(
    `${ROOT_PATH}`,
    express.static(path.join(rootDir, '/dist/'))
  )
  app.use(
    `${ROOT_PATH}/README.md`,
    express.static(path.join(rootDir, '/README.md'))
  )
  app.use(
    `${ROOT_PATH}/config/login`,
    express.static(path.join(rootDir, '/config/login'))
  )
  app.use(
    `${ROOT_PATH}/config/css`,
    ensureUser(),
    express.static(path.join(rootDir, '/config/css'))
  )
  app.use(
    `${ROOT_PATH}/config/js`,
    ensureUser(),
    express.static(path.join(rootDir, '/config/js'))
  )
  app.use(
    `${ROOT_PATH}/config/pre`,
    ensureUser(),
    express.static(path.join(rootDir, '/config/pre'))
  )
  app.use(
    `${ROOT_PATH}/config/fonts`,
    ensureUser(),
    express.static(path.join(rootDir, '/config/fonts'))
  )

  if (process.argv.includes('--with_examples')) {
    app.use(
      `${ROOT_PATH}/examples`,
      express.static(path.join(rootDir, '/examples'))
    )
  }
  app.use(`${ROOT_PATH}/public`, express.static(path.join(rootDir, '/public')))
  app.use(
    `${ROOT_PATH}/Missions`,
    ensureUser(),
    middleware.missions(),
    express.static(path.join(rootDir, '/Missions'))
  )

  if (isDevEnv) {
    app.use(
      `${ROOT_PATH}/css`,
      ensureUser(),
      express.static(path.join(rootDir, '/css'))
    )
    app.use(
      `${ROOT_PATH}/src`,
      ensureUser(),
      express.static(path.join(rootDir, '/src'))
    )
  }

  // Disable for now
  // app.use("/API/apis", apiRouter);

  // PAGES

  // docs
  app.get(
    `${ROOT_PATH}/docs`,
    ensureUser(),
    ensureGroup(permissions.users),
    (req, res) => {
      res.render('docs', {})
    }
  )

  // API
  // TEST
  app.post(`${ROOT_PATH}/api/test`, function (req, res) {
    res.send('Hello World!')
  })

  // TODO: Remove or move to Setup structure. Some are definitely still used.

  // utils getprofile
  app.post(
    `${ROOT_PATH}/api/utils/getprofile`,
    ensureUser(),
    ensureGroup(permissions.users),
    function (req, res) {
      const path = encodeURIComponent(req.body.path)
      const lat1 = encodeURIComponent(req.body.lat1)
      const lon1 = encodeURIComponent(req.body.lon1)
      const lat2 = encodeURIComponent(req.body.lat2)
      const lon2 = encodeURIComponent(req.body.lon2)
      const steps = encodeURIComponent(req.body.steps)
      const axes = encodeURIComponent(req.body.axes)

      cp.execFile(
        'python',
        [
          'private/api/2ptsToProfile.py',
          path,
          lat1,
          lon1,
          lat2,
          lon2,
          steps,
          axes,
          1
        ],
        function (error, stdout, stderr) {
          if (error) {
            console.log(error)
          }
          res.send(stdout)
        }
      )
    }
  )

  // utils getbands
  app.post(
    `${ROOT_PATH}/api/utils/getbands`,
    ensureUser(),
    ensureGroup(permissions.users),
    function (req, res) {
      const path = encodeURIComponent(req.body.path)
      const x = encodeURIComponent(req.body.x)
      const y = encodeURIComponent(req.body.y)
      const xyorll = encodeURIComponent(req.body.xyorll)
      const bands = encodeURIComponent(req.body.bands)

      cp.execFile(
        'python',
        ['private/api/BandsToProfile.py', path, x, y, xyorll, bands],
        function (error, stdout, stderr) {
          if (error) {
            console.log(error)
          }
          res.send(stdout)
        }
      )
    }
  )

  /*
  //http://localhost:8888/test/timeLayer?start=2022-05-12T16:10:11.648750Z&end=2022-05-12T16:25:25.084933Z
  app.get("/test/timeLayer", (req, res) => {
    res.send({
      type: "FeatureCollection",
      properties: { crs_code: "IAU2000:30100" },
      features: [
        {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [
              [137.3717, parseFloat("-4.666" + parseInt(Math.random() * 100))],
              [137.3797, parseFloat("-4.667" + parseInt(Math.random() * 100))],
            ],
          },
          properties: {
            event_utc: [req.query.start, req.query.end],
            crs_code: "IAU2000:30100",
          },
        },
      ],
    });
  });
  */

  // Validate envs
  if (isDevEnv) {
    console.log(chalk.cyan('Validating Environment Variables...\n'))
  }
  testEnv.test(setups.envs, port)

  // Attach any tool plugins to the application
  // We're only doing this for dev because we're assuming
  // build will also call this.
  if (isDevEnv) {
    console.log(chalk.cyan('Updating Tools...\n'))
    // updateTools()
  }

  /// ///Setups Init//////
  setups.init(s)

  const httpServer = http.createServer(app)
  // const mainHtml = fs.readFileSync(path.join(__dirname, '/../dist/index.html'), 'utf8')

  // Start listening for requests.
  httpServer.listen(port, (err) => {
    console.log('Now listening on port: ' + port)
    // if (isDevEnv) {
    //   // setTimeout(setupDevServer, 2000)
    //   app.get('/', ensureUser(), (req, res) => {
    //     console.log('Root path hit 0!')
    //     res.redirect(`http://localhost:${port + 1}`)
    //   })
    // } else {
    //   // Each calls the ensureGroup middleware,
    //   // passing to it an array of LDAP group names (which were loaded
    //   // from the permissions.json file at the top of the file).

    // app.get('/', ensureUser(), ensureGroup(permissions.users), (req, res) => {
    //   console.log('Root path hit!')
    //   // let user = guestUsername
    //   // if (process.env.AUTH === 'csso' || req.user != null) user = req.user
    //   // let permission = '000'
    //   // if (process.env.AUTH === 'csso') permission = '001'
    //   // if (req.session.permission) permission = req.session.permission
    //   // const groups = req.groups ? Object.keys(req.groups) : []
    //   res.send(mainHtml)
    // })
    // }
    if (err) {
      logger('infrastructure_error', 'MMGIS did not start!', 'server')
      return err
    }

    /// ///Setups Started//////
    setups.started(s)

    logger(
      'success',
      "MMGIS successfully started! It's listening on port: " + port,
      'server'
    )

    if (process.env.ENABLE_MMGIS_WEBSOCKETS) {
      console.log(chalk.cyan('Starting websocket...\n'))
      websocket.init(httpServer)
    }
  })
})
