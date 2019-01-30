export function fromNode (modulePath: string, options?: any) {
  let mod
  try {
    mod = require(modulePath).default
  } catch (err) {
    const prequire = require('parent-require')

    if (err.code === 'MODULE_NOT_FOUND') {
      // TODO: proper way to display error
      // Some error return as MODULE_NOT_FOUND
      mod = prequire(modulePath).default
    } else {
      throw err
    }
  }

  return options ? { module: mod, options } : mod
}

export function fromM (modulePath: string, options?: any) {
  return fromNode(`magnet-${modulePath}`, options)
}

export function fromLocal (modulePath: string, options?: any) {
  let localModulesPath: string = 'local_modules'
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    localModulesPath = 'dist/local_modules'
  }
  const mod = require(`${process.cwd()}/${localModulesPath}/${modulePath}`).default

  return options ? { module: mod, options } : mod
}
