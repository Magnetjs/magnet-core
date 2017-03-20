import * as bunyan from 'bunyan'
import * as prequire from 'parent-require'

import Magnet from './magnet'
import { App } from './app'
import { Module, RuntimeModule } from './module'
import { performTasks } from './process'
import { errorHandler } from './utils'
import copyConfig from './copy-config'
import defaultConfig from './config/magnet'

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

    let autoCopyConfig = defaultConfig.autoCopyConfig
    autoCopyConfig = (app.config && app.config.magnet && app.config.magnet.autoCopyConfig)
                      ? app.config.magnet.autoCopyConfig
                      : autoCopyConfig
    if (autoCopyConfig) {
      await copyConfig()
    }

    app.log.info('Ready')

    return app
  } catch (err) {
    app.log.error(err.stack)
    throw err
  }
}

export function fromNode (modulePath: string, options?: any) {
  let mod
  try {
    mod = require(modulePath).default
  } catch (err) {
    mod = prequire(modulePath).default
  }

  return options ? { module: mod, options } : mod
}

export function fromM (modulePath: string, options?: any) {
  let mod
  try {
    mod = require(`magnet-${modulePath}`).default
  } catch (err) {
    mod = prequire(`magnet-${modulePath}`).default
  }

  return options ? { module: mod, options } : mod
}

export function fromLocal (modulePath: string, options?: any) {
  const localModulesPath: string = 'local_modules'
  const mod = require(`${process.cwd()}/${localModulesPath}/${modulePath}`).default

  return options ? { module: mod, options } : mod
}
