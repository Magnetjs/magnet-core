import flow = require('lodash/fp/flow')
import map = require('lodash/fp/map')
import reverse = require('lodash/fp/reverse')
import flatten = require('lodash/fp/flatten')
import compact = require('lodash/fp/compact')

import { reflect, retrieveReflect } from './utils'
import { LogAbstract } from './log'

export default class Magnet {
  teardowns: any[] = []
  log: LogAbstract

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
