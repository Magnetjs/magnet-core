import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import reverse from 'lodash/fp/reverse'
import flatten from 'lodash/fp/flatten'
import compact from 'lodash/fp/compact'

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

async function performTasks (app, modules) {
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

async function errorHandler (app, err) {
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

export default async function Magnet (modules) {
  let app = {
    magnet: {
      async shutdown () {
        const result = await Promise.all(
          flow(
            flatten,
            compact,
            reverse,
            map((teardown) => teardown())
          )(app.magnet.teardowns)
          .map(reflect)
        )

        const fails = retrieveReflect(result, 'error')
        if (fails.length) {
          for (const fail of fails) {
            app.magnet.log.error(fail)
          }

          throw new Error('Some modules cannot teardown')
        }
      },
      teardowns: [],
      log: new Log(app, { name: 'magnet-core', level: 'error' })
    }
  }

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
      await copyConfig(app)
    }

    app.magnet.log.info('Ready')

    return app
  } catch (err) {
    app.magnet.log.error(err.stack)
    throw err
  }
}
