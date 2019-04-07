import * as mongoose from "mongoose";
import * as defaultConfig from "./config";

export default async function setup({ config, log, magnetModule }) {
  try {
    const { uri, ...preparedConfig } = Object.assign(
      defaultConfig,
      magnetModule.config
    );

    const mongoose = await mongoose.connect(
      uri,
      preparedConfig
    );

    return {
      registers: [
        {
          name: magnetModule.name || "mongoose",
          value: mongoose
        }
      ],

      async teardown() {
        mongoose.shutdown();
      }
    };
  } catch (err) {
    log.error(err);
  }
}
