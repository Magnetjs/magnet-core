export const modules = [
  require("@magnetjs/acl").default,
  require("@magnetjs/aws").default,
  require("@magnetjs/bull").default,
  require("@magnetjs/config").default,
  require("@magnetjs/email-templates").default,
  require("@magnetjs/folder-loader").default,
  require("@magnetjs/google-maps").default,
  require("@magnetjs/greenlock-express").default,
  require("@magnetjs/koa-router").default,
  require("@magnetjs/koa").default,
  require("@magnetjs/nodemailer").default,
  require("@magnetjs/passport").default,
  require("@magnetjs/pino").default,
  require("@magnetjs/redis").default,
  require("@magnetjs/sequelize").default,
  require("@magnetjs/twilio").default,
  require("@magnetjs/umzug").default,
  require("@magnetjs/grpc/client").default,

  // new feature
  "local_modules/*.js",
  [require("@magnetjs/sequelize").default, "seq"]
];

export default modules;
