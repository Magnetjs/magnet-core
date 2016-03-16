# Module boilerplate
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

# App structure
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
