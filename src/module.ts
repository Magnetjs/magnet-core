import isObject = require('lodash/isObject')
import isFunction = require('lodash/isFunction')

import { LogAbstract } from './log'
import { App } from './app'

export interface RuntimeModule {
  module: Module
  options: any
}

export abstract class Module {
  moduleName: string
  defaultConfig: any
  app: App
  log: LogAbstract
  config: any
  options: any
  private _name: string

  constructor (app: App, options: any = {}) {
    this.app = app
    this.log = app.log
    this.options = options

    if (options.moduleName) {
      this.moduleName = options.moduleName
    }

    // Until es7 have a way to initialize property
    if (this.moduleName) {
      this.config = this.prepareConfig(
        this.moduleName,
        (typeof this.defaultConfig === 'string')
          ? require(`${this.defaultConfig}/config/${this.moduleName}`).default
          : this.defaultConfig
      )
    } else {
      this.config = app.config
    }
  }

  get name (): string {
    return this._name || this.constructor.name
  }

  set name (newName: string) {
    this._name = newName;
  }

  set moduleName (newModuleName: string) {
    this.moduleName = newModuleName;
  }

  // depreciated, use prepareConfig
  setConfig (ns: string, dConfig: any = {}): any {
    this.log.warn(`setConfig is depreciated, use prepareConfig instead`)
    // return Object.assign(dConfig, this.app.config[ns], this.options)
  }

  prepareConfig (ns: string = '', dConfig: any = {}): any {
    if (isFunction(dConfig)) {
      dConfig = dConfig(this.app)
    }

    if (ns) {
      return Object.assign(dConfig, this.app.config[ns], this.options)
    } else {
      return Object.assign(dConfig, this.options)
    }
  }

  insert (currentModule: any, ns?: string) {
    if (!ns) {
      ns = this.moduleName
    }

    if (this.app[ns]) {
      this.log.warn(`${this.name}: Module ${ns} already exist, overridden anyway`)
    }

    this.app[ns] = currentModule
  }

  async setup (): Promise<void> {
    this.log.warn(`Module ${this.name} missing setup function`)
  }

  async teardown (): Promise<any> {}
}
