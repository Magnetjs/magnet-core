export const modules = [
  require("@magnetjs/next.js").default,
  require("@magnetjs/passport").default,
  require("@magnetjs/pino").default,
  "local_modules/*.js"
];

export default modules;
