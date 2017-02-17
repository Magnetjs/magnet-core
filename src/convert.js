import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

import Base from './base'
import { isClass } from './utils'

/**
 * A simple module to quickly convert nodejs module to Magnet module
 * @param  {[function, object]} module      Module to be converted
 * @param  {string} options.namespace   Namespace to occupy, same for app[namespace], config[namespace]
 * @param  {string} options.initializer Initialize function
 * @param  {[array, function]} options.params      Will pass to initializer
 * @return void
 */
export default function convert (module, { namespace, initializer, params, teardown }, defaultConfig = {}) {
  return class MagnetModule extends Base {
    // Set class name
    // http://stackoverflow.com/a/41787315/788518
    static get name () { return namespace }

    async setup () {
      const config = this.setConfig(namespace, defaultConfig)

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
        this.app[namespace] = new initialize(...moduleParams)
      } else {
        this.app[namespace] = initialize(...moduleParams)
      }
    }

    async teardown () {
      if (teardown && this.app[namespace] && this.app[namespace][teardown]) {
        this.app[namespace][teardown]()
        this.log.info(`${namespace} teardown completed`)
      }
    }
  }
}
