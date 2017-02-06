import bunyan from 'bunyan'

// TODO: Refactor
export default class Log {
  constructor (app, options = {}) {
    this.app = app
    this.log = bunyan.createLogger(options)
  }

  info (...message) {
    if (this.app && this.app.log && this.app.log.info) {
      this.app.log.info(...message)
    } else {
      this.log.info(...message)
    }
  }

  error (...message) {
    if (this.app && this.app.log && this.app.log.error) {
      this.app.log.error(...message)
    } else {
      this.log.error(...message)
    }
  }

  warn (...message) {
    if (this.app && this.app.log && this.app.log.error) {
      this.app.log.warn(...message)
    } else {
      this.log.warn(...message)
    }
  }
}

// function coreLog.info (app, message) {
//   if (app && app.log && app.log.info) {
//     app.log.info(message)
//   } else {
//     app.coreLog.info(message)
//   }
// }

// function coreLog.error (app, message) {
//   if (app && app.log && app.log.error) {
//     app.log.error(message)
//   } else {
//     app.coreLog.error(app, message)
//   }
// }

// function coreLog.warn (app, message) {
//   if (app && app.log && app.log.error) {
//     app.log.warn(message)
//   } else {
//     app.coreLog.warn(app, message)
//   }
// }
