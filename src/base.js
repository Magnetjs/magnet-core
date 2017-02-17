export default class Base {
  constructor (app = {}, options = {}) {
    this.app = app
    this.log = app.log
    this.config = app.config
    this.options = options
  }

  setConfig (ns, dConfig) {
    this.config = Object.assign(dConfig, this.config[ns], this.options)
    return this.config
  }
}
