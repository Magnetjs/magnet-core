import bunyan from 'bunyan'

// TODO: Refactor to interface
export default class Log {
  private app: any
  private log: any

  constructor (app: any, options: any = {}) {
    this.app = app
    this.log = bunyan.createLogger(options)
  }

  info (...message: any[]): void {
    if (this.app && this.app.log && this.app.log.info) {
      this.app.log.info(...message)
    } else {
      this.log.info(...message)
    }
  }

  error (...message: any[]): void {
    if (this.app && this.app.log && this.app.log.error) {
      this.app.log.error(...message)
    } else {
      this.log.error(...message)
    }
  }

  warn (...message: any[]): void {
    if (this.app && this.app.log && this.app.log.error) {
      this.app.log.warn(...message)
    } else {
      this.log.warn(...message)
    }
  }
}
