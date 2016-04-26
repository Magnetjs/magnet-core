/**
 * We can change setup to be middleware based, but now let keep it simple with array only.
 */
export default async function Magnet(modules = []) {
  let app = {};
  let starts = [];
  let teardowns = [];

  function consoleInfo(app, message) {
    if (app && app.log && app.log.info) {
      app.log.info(message);
    } else {
      console.log(message);
    }
  }

  function consoleError(app, message) {
    if (app && app.log && app.log.error) {
      app.log.error(message);
    } else {
      console.error(app, message);
    }
  }

  async function performTasks(arr) {
    let Modules = arr.shift();

    if (!Array.isArray(Modules)) {
      Modules = [Modules];
    }

    let setups = [];
    for (let Module of Modules) {
      let task;
      if (Module.module) {
        task = new Module.module(app, Module.options);
      } else {
        task = new Module(app);
      }

      if (task.setup) {
        setups.push(await task.setup());
      }

      if (task.start) {
        starts.push(task.start.bind(task));
      }

      if (task.teardown) {
        teardowns.push(task.teardown.bind(task));
      }
    }

    await setups;

    if (arr.length) {
      await performTasks(arr);
    }
  }

  async function errorHandler(err) {
    try {
      let closing = [];
      for (let teardown of teardowns) {
        closing.push(teardown());
      }
      await Promise.all(closing);
    } catch (err) {
      consoleError(app, err);
    } finally {
      consoleInfo(app, 'finally');
      process.kill(process.pid, 'SIGUSR2');
    }
  }

  process.once('uncaughtException', errorHandler);
  process.once('SIGUSR2', errorHandler);

  try {
    if (modules.length) {
      await performTasks(modules);

      for (let start of starts.reverse()) {
        await start();
      }

      consoleInfo(app,'Ready');
    } else {
      consoleInfo(app,'No modules provided.');
    }

    return app;
  } catch (err) {
    consoleError(app, err.stack);
  }
}
