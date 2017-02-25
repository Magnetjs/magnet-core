import get = require('lodash/get')
import isFunction = require('lodash/isFunction')

import { Module } from './module'
import { isClass } from './utils'
import { LogAbstract } from './log'
import { App } from './app'

/**
 * A simple module to quickly convert nodejs module to Magnet module
 * @param  {[function, object]} module      Module to be converted
 * @param  {string} options.namespace   Namespace to occupy, same for app[namespace], config[namespace]
 * @param  {string} options.initializer Initialize function
 * @param  {[array, function]} options.params      Will pass to initializer
 * @return void
 */
export default function convert (module, convertOptions, defaultConfig = {}): any {
  const { initializer, params, teardown } = convertOptions
  const moduleName = convertOptions.namespace

  return class ConvertMagnetModule extends Module {
    // Set class name
    // http://stackoverflow.com/a/41787315/788518
    // static get name () { return namespace }

    constructor (app: App, options: any = {}) {
      super(app, options)

      this.name = moduleName
    }

    async setup (): Promise<void> {
      const config = this.prepareConfig(moduleName, defaultConfig)

      // Prepare parameters
      let moduleParams = []
      if (isFunction(params)) {
        moduleParams = [params(config)]
      } else if (Array.isArray(params)) {
        for (const param of params) {
          if (param.startsWith('config.')) {
            const configKey = param.replace('config.', '')

            moduleParams.push(get(config, configKey))
          } else if (param === 'config') {
            moduleParams.push(config)
          }
        }
      } else {
        this.log.warn('Params is not recognized')
      }

      const initialize = module[initializer] || module
      if (isClass(initialize)) {
        this.app[moduleName] = new initialize(...moduleParams)
      } else {
        this.app[moduleName] = initialize(...moduleParams)
      }
    }

    async teardown (): Promise<void> {
      if (teardown && this.app[moduleName] && this.app[moduleName][teardown]) {
        this.app[moduleName][teardown]()
        this.log.info(`${moduleName} teardown completed`)
      }
    }
  }
}
