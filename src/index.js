/**
 * We can change setup to be middleware based, but now let keep it simple with array only.
 */
export default async function Magnet(modules = []) {
  let app = {};
  let starts = [];
  let teardowns = [];

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

  try {
    if (modules.length) {
      await performTasks(modules);

      for (let start of starts.reverse()) {
        await start();
      }

      console.log('Ready');
    } else {
      console.log('No modules provided.');
    }

    return app;
  } catch (err) {
    console.error(err.stack);
  }
}
