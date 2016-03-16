export default class Base {
  constructor(app = {}) {
    this.app = app;
    this.log = app.log;
    this.config = app.config;
  }
}
