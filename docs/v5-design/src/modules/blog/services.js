export default function blogServices({ models, log, elasticSearch }) {
  return {
    async scheduledPublish(input) {
      try {
        const scheduledBlogs = await models.blog.findAll();

        const updates = scheduledBlogs.map(async function(scheduledBlog) {
          scheduledBlog.published = true;
          const updatedBlog = await scheduledBlog.save();
          await elasticSearch.index(updatedBlog);
          return updatedBlog;
        });

        await Promise.all(updates);
      } catch (err) {
        log.error(err);
        throw err;
      }
    }
  };
}
