export default function({ route, ctrls }) {
  route
    .get("blogs", async (ctx, next) => {
      ctx.body = await ctrls.blog.list(ctx.params);
    })
    .post("blogs", async (ctx, next) => {
      ctx.body = await ctrls.blog.create(ctx.params);
    });
}
