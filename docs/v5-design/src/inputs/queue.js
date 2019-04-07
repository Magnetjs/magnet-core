export default function({ log, bull, svcs }) {
  bull.process("scheduledPublish", async function(job, done) {
    await svcs.blog.scheduledPublish(job.data);

    // If the job throws an unhandled exception it is also handled correctly
    throw new Error("some unexpected error");
  });
}
