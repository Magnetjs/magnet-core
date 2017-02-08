import fsExtra from 'fs-extra'
import glob from 'glob'
import _promise from 'bluebird'
import updateNotifier from 'update-notifier'
import differenceWith from 'lodash/fp/differenceWith'
import without from 'lodash/fp/without'
import flow from 'lodash/fp/flow'
import map from 'lodash/fp/map'
import compact from 'lodash/fp/compact'
import flatten from 'lodash/flatten'
import intersection from 'lodash/intersection'
import pkg from './package.json'

export default async function (app) {
  const globAsync = _promise.promisify(glob)
  const fse = _promise.promisifyAll(fsExtra)

  const getNodeModulePackageJSON = async function (inputs) {
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

  const getModuleConfigFiles = async function (files) {
    const configFiles = await _promise.all(
      files.map(async (moduleName) => {
        return await globAsync(`${process.cwd()}/node_modules/${moduleName}/**/config/*.js`)
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
      app.magnet.log.info(`Copying ${file.path}`)
      return fse.copyAsync(file.path, `./server/config/${file.name}`)
    })
  )

  try {
    updateNotifier({ pkg }).notify()

    const allPackageJSON = await getNodeModulePackageJSON()
    const magnetModules = filterOutMagnetModule(allPackageJSON)
    let [moduleConfigFiles, localModuleConfigFiles, currentConfigFiles] = await _promise.all([
      getModuleConfigFiles(magnetModules),
      globAsync(`${process.cwd()}/local_modules/**/config/*.js`),
      globAsync('./server/config/**.js')
    ])

    moduleConfigFiles = formatPath(moduleConfigFiles)
    localModuleConfigFiles = formatPath(localModuleConfigFiles)
    currentConfigFiles = formatPath(currentConfigFiles)

    await _promise.all([
      ...copyFiles(moduleConfigFiles, currentConfigFiles),
      ...copyFiles(localModuleConfigFiles, currentConfigFiles)
    ])
    app.magnet.log.info('Completed copy config files')
  } catch (err) {
    app.magnet.log.error(err)
  }
}
