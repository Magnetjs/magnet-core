export default function({ ctrls }) {
  return {
    async blogs(obj, args, context, info) {
      return ctrls.blog.index(args);
    }
  };
}
