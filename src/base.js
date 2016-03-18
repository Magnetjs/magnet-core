export default class Base {
  constructor(app = {}, options = {}) {
    this.app = app;
    this.log = app.log;
    this.config = app.config;
    this.options = options;
  }
}
