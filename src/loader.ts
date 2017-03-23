import * as prequire from 'parent-require'

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
  let localModulesPath: string = 'local_modules'
  if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
    localModulesPath = 'dist/local_modules'
  }
  const mod = require(`${process.cwd()}/${localModulesPath}/${modulePath}`).default

  return options ? { module: mod, options } : mod
}
