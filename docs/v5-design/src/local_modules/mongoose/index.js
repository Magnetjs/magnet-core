import * as mongoose from "mongoose";
import * as defaultConfig from "./config";

export default async function setup({ config, log, magnetModule }) {
  try {
    const { uri, ...preparedConfig } = Object.assign(
      defaultConfig,
      magnetModule.config
    );

    const mongooseConnection = await mongoose.connect(
      uri,
      preparedConfig
    );

    return {
      registers: [
        {
          key: magnetModule.name || "mongoose",
          value: mongooseConnection
        }
      ],

      async teardown() {
        mongooseConnection.close();
      }
    };
  } catch (err) {
    log.error(err);
    throw err;
  }
}
