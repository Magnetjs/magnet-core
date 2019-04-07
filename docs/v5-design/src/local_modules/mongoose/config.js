import * as bluebird from "bluebird";

export default {
  uri: "mongodb://localhost/magnet-development",
  useMongoClient: true,
  promiseLibrary: bluebird
};
