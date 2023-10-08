const router = require('./routes/utils')
const setup = {
  // Once the app initializes
  onceInit: (s) => {
    s.app.use(
      s.ROOT_PATH + '/API/utils',
      s.ensureUser(),
      s.setContentType,
      router
    )
  },
  // Once the server starts
  onceStarted: (s) => {},
  // Once all tables sync
  onceSynced: (s) => {}
}

module.exports = setup
