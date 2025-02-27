const Sequelize = require('sequelize')
const logger = require('../API/logger')
const { join } = require('path')
require('dotenv').config({ path: join(__dirname, '/../.env') })

initializeDatabase()
  .then(() => {
    logger('info', 'Finished successfully.', 'connection')
    process.exit()
  })
  .catch((err) => {
    logger('info', 'Failed.', 'connection', err)
    process.exit(1)
  })

async function initializeDatabase () {
  return new Promise(async (resolve, reject) => { // eslint-disable-line no-async-promise-executor
    const baseSequelize = new Sequelize(
      null,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: process.env.VERBOSE_LOGGING === 'true' || false,
        pool: {
          max: 10,
          min: 0,
          acquire: 30000,
          idle: 10000
        }
      }
    )
    await baseSequelize
      .query(`CREATE DATABASE "${process.env.DB_NAME}";`)
      .then(() => {
        logger(
          'info',
          `Created ${process.env.DB_NAME} database.`,
          'connection'
        )
        keepGoing()
        return null
      })
      .catch((err) => { // eslint-disable-line n/handle-callback-err
        logger(
          'info',
          `Database ${process.env.DB_NAME} already exists. Nothing to do...`,
          'connection'
        )
        keepGoing()
        return null
      })

    async function keepGoing () {
      const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
          host: process.env.DB_HOST,
          dialect: 'postgres',
          logging: process.env.VERBOSE_LOGGING === 'true' || false,
          pool: {
            max: 10,
            min: 0,
            acquire: 30000,
            idle: 10000
          }
        }
      )
      // Source: http://docs.sequelizejs.com/manual/installation/getting-started.html
      sequelize
        .authenticate()
        .then(async () => {
          logger('info', 'Database connection is successful.', 'connection')
          await sequelize
            .query('CREATE EXTENSION postgis;')
            .then(() => {
              logger('info', 'Created POSTGIS extension.', 'connection')
              resolve()
              return null
            })
            .catch((err) => { // eslint-disable-line n/handle-callback-err
              logger(
                'info',
                'POSTGIS extension already exists. Nothing to do...',
                'connection'
              )

              return null
            })
          await sequelize
            .query(
              `
            CREATE TABLE "session" (
              "sid" varchar NOT NULL COLLATE "default",
              "sess" json NOT NULL,
              "expire" timestamp(6) NOT NULL
            )
            WITH (OIDS=FALSE);
            
            ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
            
            CREATE INDEX "IDX_session_expire" ON "session" ("expire");`
            )
            .then(() => {
              logger('info', 'Created "session" table.', 'connection')
              return null
            })
            .catch((err) => { // eslint-disable-line n/handle-callback-err
              logger(
                'info',
                '"session" table already exists. Nothing to do...',
                'connection'
              )
              resolve()
              return null
            })
          resolve()
        })
        .catch((err) => {
          logger(
            'infrastructure_error',
            'Unable to connect to the database.',
            'connection',
            null,
            err
          )
          reject(Error('Unable to connect to the database.'))
          return null
        })
    }
    return null
  })
}
