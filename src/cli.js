#!/usr/bin/env node
import 'babel-polyfill'

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
import pkg from './package.json'

(async function () {
  const globAsync = _promise.promisify(glob)
  const fse = _promise.promisifyAll(fsExtra)

  const getPackageJSON = async function (inputs) {
    const allPackageJSON = await globAsync('./node_modules/*/package.json')

    return await _promise.all(
      allPackageJSON.map((packageJSONPath) => fse.readJsonAsync(packageJSONPath))
    )
  }

  const getMagnetModule = flow(
    map((json) => {
      if (!json.keywords || json.keywords.indexOf('magnet') === -1) {
        return
      }

      return json.name
    }),
    compact,
    without(['magnet-core', 'magnet-config'])
  )

  const getModuleConfigFiles = async function (files) {
    const configFiles = await _promise.all(
      files.map(async (moduleName) => {
        return await globAsync(`${process.cwd()}/node_modules/${moduleName}/**/config/*.js`)
      })
    )

    return flatten(configFiles)
  }

  const getLocalModuleConfigFiles = async function (files) {
    return await globAsync(`${process.cwd()}/local_modules/**/config/*.js`)
    const configFiles = await _promise.all(
      files.map(async (moduleName) => {
        return await globAsync(`${process.cwd()}/local_modules/**/config/*.js`)
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

  const copyFile = flow(
    differenceWith(
      (moduleFile, currentFile) => moduleFile.name === currentFile.name
    ),
    map((file) => fse.copyAsync(file.path, `./server/config/${file.name}`))
  )

  try {
    const allPackageJSON = await getPackageJSON()
    const magnetModules = getMagnetModule(allPackageJSON)
    let [moduleConfigFiles, localModuleConfigFiles, currentConfigFiles] = await _promise.all([
      getModuleConfigFiles(magnetModules),
      getLocalModuleConfigFiles(),
      globAsync('./server/config/**.js')
    ])

    moduleConfigFiles = formatPath(moduleConfigFiles)
    localModuleConfigFiles = formatPath(localModuleConfigFiles)
    currentConfigFiles = formatPath(currentConfigFiles)

    await _promise.all(
      copyFile(moduleConfigFiles, currentConfigFiles)
    )
    await _promise.all(
      copyFile(localModuleConfigFiles, currentConfigFiles)
    )
    console.log('Completed copy config files')

    updateNotifier({ pkg }).notify()
  } catch (err) {
    console.error(err)
  }
})()
