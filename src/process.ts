import { reflect, retrieveReflect, PromiseReflect } from './utils'
import { App } from './app'

export async function setupModules (app: App, pModule): Promise<PromiseReflect> {
  try {
    let task
    let Module
    let parameters = [app]

    if (!pModule) {
      return
    }

    if (pModule.module) {
      Module = pModule.module
      parameters.push(pModule.options)
    } else {
      Module = pModule
    }

    task = new Module(...parameters)

    await task.setup()

    if (task.teardown) {
      return task.teardown.bind(task)
    }
  } catch (err) {
    throw err
  }
}

export async function performTasks (app: App, modules: any[]): Promise<{
  fails: PromiseReflect[]
  teardowns: PromiseReflect[]
}> {
  let allModuleDone
  let teardowns = []
  let fails = []

  try {
    modules = modules.map((module) => Array.isArray(module) ? module : [module])

    for (let mdls of modules) {
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
    app.log.error(err)
    return { teardowns, fails }
  }
}
