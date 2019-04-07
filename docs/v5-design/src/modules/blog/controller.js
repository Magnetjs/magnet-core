import { permission } from "@magnetjs/node-acl";

export default function({ models, log }) {
  return {
    @permission("blog", "list")
    async list(input) {
      try {
        return models.blog.findAll();
      } catch (err) {
        log.error(err);
        throw err;
      }
    },

    @permission("blog", "create")
    async create(input) {
      try {
        return models.blog.create(input);
      } catch (err) {
        log.error(err);
        throw err;
      }
    }
  };
}
