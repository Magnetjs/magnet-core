import flatten from 'lodash/flatten'

function consoleInfo (app, message) {
  if (app && app.log && app.log.info) {
    app.log.info(message)
  } else {
    console.log(message)
  }
}

function consoleError (app, message) {
  if (app && app.log && app.log.error) {
    app.log.error(message)
  } else {
    console.error(app, message)
  }
}

async function performTasks (app, modules) {
  const tds = []
  try {
    for (const Module of modules) {
      if (Array.isArray(Module)) {
        tds.push(await performTasks(app, Module))
      } else {
        let task
        if (Module.module) {
          task = new Module.module(app, Module.options)
        } else {
          task = new Module(app)
        }

        if (task.setup) {
          await task.setup()
        }

        if (task.teardown) {
          tds.push(task.teardown.bind(task))
        }
      }
    }

    return tds
  } catch (err) {
    consoleError(app, err)
    return tds
  }
}

/**
 * We can change setup to be middleware based, but now let keep it simple with array only.
 */
export default async function Magnet (modules = []) {
  let app = {}
  try {
    let teardowns = []

    const errorHandler = async function (err) {
      if (err) {
        consoleError(app, err)
      }

      try {
        await Promise.all(
          flatten(teardowns)
            .reverse()
            .map((teardown) => teardown())
        )
      } catch (err) {
        consoleError(app, err)
      } finally {
        consoleInfo(app, 'Complete teardown all Magnet\'s module')
        process.kill(process.pid, 'SIGUSR2')
      }
    }

    process.once('uncaughtException', errorHandler)
    process.once('SIGUSR2', errorHandler)
    process.once('SIGINT', errorHandler)

    if (!Array.isArray(modules)) {
      consoleError(app, 'Modules should pass in as array')
      return
    } else if (!modules.length) {
      consoleInfo(app, 'No modules provided')
      return
    }

    teardowns = await performTasks(app, modules)

    consoleInfo(app, 'Ready')

    return app
  } catch (err) {
    consoleError(app, err.stack)
  }
}
