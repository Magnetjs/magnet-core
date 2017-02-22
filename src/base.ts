export default class Base {
  protected app: any
  protected log: any
  protected config: any
  protected options: any

  constructor (app: any = {}, options: any = {}) {
    this.app = app
    this.log = app.log
    this.config = app.config
    this.options = options
  }

  setConfig (ns: string, dConfig: any): any {
    return Object.assign(dConfig, this.config[ns], this.options)
  }

  async setup (): Promise<void> {}

  async teardown (): Promise<void> {}
}
