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

  constructor (app: App, options: any = {}) {
    this.app = app
    this.log = app.log
    this.config = app.config
    this.options = options
  }

  getName (): string {
    return this.constructor.name
  }

  setConfig (ns: string, dConfig: any): any {
    return Object.assign(dConfig, this.config[ns], this.options)
  }

  async setup (): Promise<void> {
    this.log.warn(`Module ${this.getName()} missing setup function`)
  }

  async teardown (): Promise<void> {}
}
