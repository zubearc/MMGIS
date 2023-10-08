const router = require('./routes/shortener')

const setup = {
  // Once the app initializes
  onceInit: (s) => {
    s.app.use(
      s.ROOT_PATH + '/API/shortener',
      s.ensureUser(),
      s.checkHeadersCodeInjection,
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
