import { LogAbstract } from './log'
import { App } from './app'

export interface RuntimeModule {
  module: Module
  options: any
}

export abstract class Module {
  app: App
  log: LogAbstract
  config: any
  options: any
  private _name: string;

  constructor (app: App, options: any = {}) {
    this.app = app
    this.log = app.log
    this.config = app.config
    this.options = options
  }

  get name (): string {
    return this._name || this.constructor.name
  }

  set name (newName: string) {
    this._name = newName;
  }

  // depreciated, use getConfig
  setConfig (ns: string, dConfig: any = {}): any {
    this.log.warn(`setConfig is depreciated, use prepareConfig instead`)
    return Object.assign(dConfig, this.config[ns], this.options)
  }

  prepareConfig (ns: string, dConfig: any = {}): any {
    return Object.assign(dConfig, this.config[ns], this.options)
  }

  async setup (): Promise<void> {
    this.log.warn(`Module ${this.name} missing setup function`)
  }

  async teardown (): Promise<any> {}
}
