#!/usr/bin/env node
import 'babel-polyfill'

import copyConfig from './copy-config'

(async function () {
  await copyConfig()
})()
