[![Build Status](https://travis-ci.org/Magnetjs/magnet-core.svg?branch=master)](https://travis-ci.org/Magnetjs/magnet-core)

### Module boilerplate
```
//import Base from 'magnet-core/base';
import Base from '../core/base';

export default class Module extends Base {
  /**
   * Code to setup the module, either:
   * - Add module to this.app object
   * - Add middleware to this.app.application
   */
  async setup() {
    this.app.module = {};
  }

  /**
   * How to handle shutdown
   * Not implement yet
   */
  async teardown() {
    this.app.module = {};
  }
}
```

### App structure
```
App = {
  config: // magnet-config
  drivers: {
    influxdb: // Influx client
    influxdb2: // Influx client
    rethinkdb: // Rethinkdb client
    rethinkdbBackup: // Rethinkdb client
  },
};
```

### Usage
API Server
```
import magnet from 'magnet-core';
import Config from 'magnet-config';
import Logger from 'magnet-bunyan';
import Spdy from 'magnet-spdy';
import Common from 'magnet-server-common';
import Helmet from 'magnet-helmet';
import Router from 'magnet-router';
import Controller from 'magnet-controller';
import Mongoose from 'magnet-mongoose';
import Session from 'magnet-redis-session';
import Respond from 'magnet-respond';

magnet([
  Config,
  Logger,
  Spdy,
  [
    Respond,
    Session,
    Common,
    Helmet,
    Router,
    Mongoose
  ],
  Controller
]);
```

Scheduler Server
```
import magnet from 'magnet-core';
import Config from 'magnet-config';
import Logger from 'magnet-bunyan';
import Kue from 'magnet-kue';

magnet([
  Config,
  Logger,
  Kue
]);
```
