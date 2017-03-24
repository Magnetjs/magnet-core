import * as fsExtra from 'fs-extra'
import * as glob from 'glob'
import * as _promise from 'bluebird'
import * as differenceWith from 'lodash/fp/differenceWith'
import * as without from 'lodash/fp/without'
import * as flow from 'lodash/fp/flow'
import * as map from 'lodash/fp/map'
import * as compact from 'lodash/fp/compact'
import flatten = require('lodash/flatten')
import intersection = require('lodash/intersection')
// TODO: Only get when from cli
// import pkg from './package.json'

const globAsync = _promise.promisify(glob)
const fse = _promise.promisifyAll(fsExtra)

const getNodeModulePackageJSON = async function (): Promise<any[]> {
  const allPackageJSON = await globAsync('./node_modules/*/package.json')

  return await _promise.all(
    allPackageJSON.map((packageJSONPath) => fse.readJsonAsync(packageJSONPath))
  )
}

const filterOutMagnetModule = flow(
  map((json) => {
    if (!json.keywords || !intersection(json.keywords, ['magnet', 'magnetjs']).length) {
      return
    }

    return json.name
  }),
  compact,
  without(['magnet-config'])
)

const getModuleConfigFiles = async function (files): Promise<any[]> {
  const configFiles = await _promise.all(
    files.map(async (moduleName) => {
      return await globAsync(
        `${process.cwd()}/node_modules/${moduleName}/*/config/*.js`
      )
    })
  )

  return flatten(configFiles)
}

const formatPath = function (files) {
  return files.map((path) => ({
    path,
    name: path.split('config/')[1]
  }))
}

const copyFiles = flow(
  differenceWith(
    (moduleFile, currentFile) => moduleFile.name === currentFile.name
  ),
  map((file) => {
    return fse.copyAsync(file.path, `./src/config/${file.name}`)
  })
)

export default async function (): Promise<void> {
  try {
    const allPackageJSON = await getNodeModulePackageJSON()
    const magnetModules = filterOutMagnetModule(allPackageJSON)
    let [moduleConfigFiles, localModuleConfigFiles, currentConfigFiles] = await _promise.all([
      getModuleConfigFiles(magnetModules),
      globAsync(`${process.cwd()}/local_modules/*/config/*.js`),
      globAsync('./src/config/**.js')
    ])

    moduleConfigFiles = formatPath(moduleConfigFiles)
    localModuleConfigFiles = formatPath(localModuleConfigFiles)
    currentConfigFiles = formatPath(currentConfigFiles)

    await _promise.all([
      ...copyFiles(moduleConfigFiles, currentConfigFiles),
      ...copyFiles(localModuleConfigFiles, currentConfigFiles)
    ])
    console.log('Completed copy config files')
  } catch (err) {
    console.error(err)
  }
}
