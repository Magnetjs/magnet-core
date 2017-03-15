import isObject = require('lodash/isObject')
import isFunction = require('lodash/isFunction')

import { LogAbstract } from './log'
import { App } from './app'

export interface RuntimeModule {
  module: Module
  options: any
}

export interface ModuleMeta {
  name: string
  defaultConfig: any
}

export abstract class Module {
  app: App
  log: LogAbstract
  meta: ModuleMeta
  config: any
  options: any
  private _name: string

  constructor (app: App, options: any = {}) {
    this.app = app
    this.log = app.log
    this.options = options

    // Until es7 have a way to initialize property
    if (Array.isArray(this.meta)) {
      this.config = this.prepareConfig(
        this.meta[0],
        (this.meta.length > 2) && require(`${this.meta[1]}/config/${this.meta[0]}`).default
      )
    } else if (typeof this.meta === 'string') {
      this.config = this.prepareConfig(this.meta)
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

  insert (ns: string, currentModule: any) {
    if (!currentModule && isObject(ns)) {
      currentModule = ns
      ns = ''
    }

    if (!ns) {
      ns = this.meta[0]
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
