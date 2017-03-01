import * as bunyan from 'bunyan'

import Magnet from './magnet'
import { App } from './app'
import { Module, RuntimeModule } from './module'
import { performTasks } from './process'
import { errorHandler } from './utils'
import copyConfig from './copy-config'
import defaultConfig from './config/magnet'

let config
export default async function MagnetFn (modules: Module[]|RuntimeModule[]): Promise<App> {
  if (!Array.isArray(modules)) {
    throw new TypeError('Modules should pass in as array')
  } else if (!modules.length) {
    throw new Error('No modules provided')
  }

  let app: App = {
    log: bunyan.createLogger({ name: 'magnet-core' })
  }
  app.magnet = new Magnet(app)

  process.once('uncaughtException', errorHandler.bind(null, app))
  process.once('SIGUSR2', errorHandler.bind(null, app))
  process.once('SIGINT', errorHandler.bind(null, app))

  try {
    const tasks = await performTasks(app, modules)
    app.magnet.teardowns = tasks.teardowns

    // Check failed setup
    if (tasks.fails.length) {
      for (const fail of tasks.fails) {
        app.log.error(fail)
      }

      throw new Error('Some modules cannot setup')
    }

    if (app.config && app.config.magnet && app.config.magnet.autoCopyConfig) {
      await copyConfig()
    }

    config = app.config

    app.log.info('Ready')

    return app
  } catch (err) {
    app.log.error(err.stack)
    throw err
  }
}

export function from (modulePath, options) {
  if (options) {
    return {
      module: require(modulePath).default,
      options
    }
  } else {
    return require(modulePath).default
  }
}

export function fromLocal (modulePath, options) {
  if (options) {
    return {
      module: require(`${config.localModulesPath}/${modulePath}`).default,
      options
    }
  } else {
    return require(`${config.localModulesPath}/${modulePath}`).default
  }
}
