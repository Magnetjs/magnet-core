import flow = require('lodash/fp/flow')
import map = require('lodash/fp/map')
import reverse = require('lodash/fp/reverse')
import flatten = require('lodash/fp/flatten')
import compact = require('lodash/fp/compact')

import Log from './log'
import { reflect } from './utils'
import copyConfig from './copy-config'

function retrieveReflect (list, field) {
  return flow(
    map(field),
    compact
  )(list)
}

async function setupModules (app, pModule) {
  try {
    let task
    let Module
    let parameters = [app]

    if (!pModule) {
      app.magnet.log.warn(`Empty module`)
      return
    }

    if (pModule.module) {
      Module = pModule.module
      parameters.push(pModule.options)
    } else {
      Module = pModule
    }

    task = new Module(...parameters)

    if (task.setup) {
      await task.setup()

      if (task.teardown) {
        return task.teardown.bind(task)
      }
    } else {
      app.magnet.log.warn(`Module ${task.constructor.name} missing setup function`)
    }
  } catch (err) {
    throw err
  }
}

async function performTasks (app: any, modules: any[]): Promise<{
  fails: any[]
  teardowns: any[]
}> {
  let allModuleDone
  let teardowns = []
  let fails = []

  try {
    for (let mdls of modules) {
      if (!Array.isArray(mdls)) {
        mdls = [mdls]
      }

      mdls = mdls.map((mo) => setupModules(app, mo))

      allModuleDone = await Promise.all(mdls.map(reflect))

      teardowns.push(retrieveReflect(allModuleDone, 'value'))
      fails = retrieveReflect(allModuleDone, 'error')

      if (fails.length) {
        return { teardowns, fails }
      }
    }

    return { teardowns, fails }
  } catch (err) {
    app.magnet.log.error(err)
    return { teardowns, fails }
  }
}

async function errorHandler (app, err): Promise<void> {
  if (err) {
    app.magnet.log.error(err)
  }

  try {
    await app.magnet.shutdown(app)
    console.log('Complete teardown all Magnet\'s module')
    process.exit()
  } catch (err) {
    app.magnet.log.error(err)
    process.exit(1)
  }
}

class Magnet {
  teardowns: any[] = []
  log: any

  // constructor () {
  //
  // }
  async shutdown (): Promise<void> {
    const result = await Promise.all(
      flow(
        flatten,
        compact,
        reverse,
        map((teardown) => teardown())
      )(this.teardowns)
      .map(reflect)
    )

    const fails = retrieveReflect(result, 'error')
    if (fails.length) {
      for (const fail of fails) {
        this.log.error(fail)
      }

      throw new Error('Some modules cannot teardown')
    }
  }
}

export default async function MagnetFn (modules): Promise<Object> {
  interface App {
    magnet: Magnet
    config: any
  }

  let app: App
  app.magnet = new Magnet()
  app.magnet.log = new Log(app, { name: 'magnet-core', level: 'error' })

  process.once('uncaughtException', errorHandler.bind(null, app))
  process.once('SIGUSR2', errorHandler.bind(null, app))
  process.once('SIGINT', errorHandler.bind(null, app))

  if (!Array.isArray(modules)) {
    throw new TypeError('Modules should pass in as array')
  } else if (!modules.length) {
    throw new Error('No modules provided')
  }

  try {
    const result = await performTasks(app, modules)
    app.magnet.teardowns = result.teardowns

    if (result.fails.length) {
      for (const fail of result.fails) {
        app.magnet.log.error(fail)
      }

      throw new Error('Some modules cannot setup')
    }

    if (app.config.magnet.autoCopyConfig) {
      await copyConfig()
    }

    app.magnet.log.info('Ready')

    return app
  } catch (err) {
    app.magnet.log.error(err.stack)
    throw err
  }
}
