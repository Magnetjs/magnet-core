import * as schedule from "node-schedule";

export default function({ svcs, bull, log }) {
  var j = schedule.scheduleJob("0 0 * * *", async function() {
    try {
      await bull.add("scheduledPublish");
    } catch (err) {
      log.error(err);
    }
  });
}
