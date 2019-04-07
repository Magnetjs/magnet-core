import * as bluebird from "bluebird";

export default function({ config: { env } }) {
  const host = process.env.MONGO_ADDR || "localhost";
  const port = process.env.MONGO_PORT || "27017";
  let uri = "mongodb://localhost:27017/magnet-development";

  if (env.prod) {
    uri = `mongodb://${host}`;
  }

  const config: IMongoConfig = {
    uri,
    authSource: "admin",
    autoReconnect: true,
    useNewUrlParser: true,
    promiseLibrary: bluebird
  };
  process.env.MONGO_USER && (config.user = process.env.MONGO_USER);
  process.env.MONGO_PASS && (config.pass = process.env.MONGO_PASS);

  return config;
}

export function monitoring({ config: { env } }) {
  const host = process.env.MONGO_ADDR || "localhost";
  const port = process.env.MONGO_PORT || "27017";
  let uri = "mongodb://localhost:27017/magnet-development";

  if (env.prod) {
    uri = `mongodb://${host}`;
  }

  const config: IMongoConfig = {
    uri,
    authSource: "admin",
    autoReconnect: true,
    useNewUrlParser: true,
    promiseLibrary: bluebird
  };
  process.env.MONGO_USER && (config.user = process.env.MONGO_USER);
  process.env.MONGO_PASS && (config.pass = process.env.MONGO_PASS);

  return config;
}
