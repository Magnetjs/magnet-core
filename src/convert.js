import base from 'magnet-core/dist/base'
import get from 'lodash/get'
import isFunction from 'lodash/isFunction'

// TODO: Allow pass object as parameter

/**
 * A simple module to quickly convert nodejs module to Magnet module
 * @param  {[function, object]} module      Module to be converted
 * @param  {string} options.namespace   Namespace to occupy, same for app[namespace], config[namespace]
 * @param  {string} options.initializer Initialize function
 * @param  {[array, function]} options.params      Will pass to initializer
 * @return void
 */
export default function convert (module, { namespace, initializer, params }) {
  return class MagnetModule extends base {
    async setup () {
      const config = this.app.config[namespace]

      let moduleParams = []

      if (isFunction(params)) {
        moduleParams = [params(config)]
      } else if (Array.isArray(params)) {
        for (const param of params) {
          if (param.startsWith('config.')) {
            const configKey = param.replace('config.', '')

            moduleParams.push(get(config, configKey))
          }
        }
      } else {
        this.log.warn('Params is not recognized')
      }

      const initialize = module[initializer] || module

      this.app[namespace] = initialize(...moduleParams)
    }
  }
}
