import isObject = require('lodash/isObject')
import isFunction = require('lodash/isFunction')

import { LogAbstract } from './log'
import { App } from './app'

export interface RuntimeModule {
  module: Module
  options: any
}

export abstract class Module {
  name: string
  originalModuleName: string
  moduleName: string
  namespace: string
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
    this.name = this.constructor.name

    this.init()

    this.originalModuleName = this.moduleName
    this.namespace = options.namespace

    // Until es7 have a way to initialize property
    if (this.moduleName) {
      this.moduleName = this.moduleName.replace(/@|\/|\-/g, '_')
      this.config = this.prepareConfig(
        this.moduleName,
        (typeof this.defaultConfig === 'string')
          ? require(`${this.defaultConfig}/config/${this.moduleName}`).default
          : this.defaultConfig
      )
    }
  }

  init () {}

  prepareConfig (ns: string = '', defaultConfig: any = {}): any {
    if (isFunction(defaultConfig)) {
      defaultConfig = defaultConfig(this.app)
    }

    if (ns) {
      return Object.assign(defaultConfig, this.app.config[ns], this.options)
    } else {
      return Object.assign(defaultConfig, this.options)
    }
  }

  insert (currentModule: any, ns = '') {
    if (this.namespace) {
      ns += this.namespace
    }

    if (!ns) {
      ns += this.moduleName
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
