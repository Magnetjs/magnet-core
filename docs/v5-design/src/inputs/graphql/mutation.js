export default function({ ctrls }) {
  return {
    async createBlog(obj, args, context, info) {
      return ctrls.blog.create(args);
    }
  };
}
