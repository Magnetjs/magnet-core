import { App } from './app'
import { Module } from './module'
import { LogAbstract } from './log'

export default class Base {
  app: App
  log: LogAbstract
  config: any
  options: any

  constructor (app: any = {}, options: any = {}) {
    this.app = app
    this.log = app.log
    this.config = app.config
    this.options = options
    this.log.warn(`${this.getName()} - magnet-core/base is depreciated, extend magnet-core/module instead`)
  }

  getName () {
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
