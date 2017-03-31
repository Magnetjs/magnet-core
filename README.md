[![Build Status](https://travis-ci.org/Magnetjs/magnet-core.svg?branch=master)](https://travis-ci.org/Magnetjs/magnet-core)

### Philosophy

[![Greenkeeper badge](https://badges.greenkeeper.io/Magnetjs/magnet-core.svg)](https://greenkeeper.io/)
- Standard is god.
- It only do following:
  - Define folder structure
  - Define where to load config
  - Define how to setup and teardown modules
  - Define how to pass around module
- Everything else is up to you.

### Status
Under development, API might change for all Magnet modules.

### Module boilerplate
```
import Base from 'magnet-core/dist/base';

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
### Folders structure
- client
- docs
- universal
- local_modules
- server
  - config
  - controllers
  - emails
  - graphql
  - queues
  - schedulers
- static
- tests

### App structure
```
App = {
  config: // magnet-config
};
```

### Modules
Allow Magnet module is searchable under magnetjs keywords
[NPM search](https://www.npmjs.com/search?q=magnetjs)

### Usage
es6
```
import magnet from 'magnet-core';
import Config from 'magnet-config';
import Logger from 'magnet-bunyan';
import Router from 'magnet-router';
import FileLoader from '../local_modules/file_loader';

magnet([
  Config,
  Logger,
  Router,
  {
    module: FileLoader,
    options: ''
  }
]);
```

es5
```
var magnet = require('magnet-core').default,
var Config = ,
var Logger = ,
var Router = ,
var FileLoader = require('../local_modules/file_loader').default,

magnet([
  require('magnet-config').default,
  require('magnet-bunyan').default,
  require('magnet-router').default,
  {
    module: FileLoader,
    options: ''
  }
]);
```

Magnet style
```
import magnet, { from, fromLocal } from 'magnet-core';

magnet([
  from('magnet-config'),
  from('magnet-bunyan'),
  from('magnet-router'),
  fromLocal('file_loader'),
]);
```

### Example
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
import FileLoader from '../local_modules/file_loader';

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
  Controller,
  {
    module: FileLoader,
    options: ''
  }
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

### Convert
Utilities to quickly convert module to Magnet based
```
import algoliasearch from 'algoliasearch'
import convert from 'magnet-core/convert'

export default convert(algoliasearch, {
  namespace: 'algolia',
  params: ['config.applicationId', 'config.apiKey']
})
```

```
import convert from 'magnet-core/convert'
import googleMaps from '@google/maps'

export default convert(googleMaps, {
  namespace: 'googleMaps',
  initializer: 'createClient',
  params: (config) => ({ key: config.apiKey, Promise: global.Promise })
})
```

### Naming
All magnet module is store under app variables.
To avoid conflict some rules is introduced.
- magmet, config, log is reserved
- npm organization scope replaced with underscore

```
// Reserved
const app = {
  magnet: null,
  config: null,
  log: null,
}

this.app.koa = new Koa()
this.app._googleMaps = require('@google/maps').createClient({
  key: 'your API key here'
})
```

### CLI
Magnet come with cli command to copy all config files from following to `server/config`:
- `local_modules/**/config/*.js`
- `node_modules/**/config/*.js`

Just run from `./node_modules/.bin/magnet`

Or install globally `npm install -g magnet-core` `yarn global add magnet-core`
And run `magnet`

### Roadmap
- Find solution to copy config/* without babel
- Update `config/*.js` when extra field introduced
- Make this.app = {} immutable? Only can set via Module.set('redis', redis), or map, or both

### Todo
- Why copyConfig doesn't get magnet-koa/config/koa
