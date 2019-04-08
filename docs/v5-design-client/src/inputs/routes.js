export default function({ fastify, nextjsApp }) {
  fastify.get("/a", (req, reply) => {
    return nextjsApp.render(req.req, reply.res, "/a", req.query).then(() => {
      reply.sent = true;
    });
  });

  fastify.get("/b", (req, reply) => {
    return nextjsApp.render(req.req, reply.res, "/b", req.query).then(() => {
      reply.sent = true;
    });
  });

  fastify.get("/*", (req, reply) => {
    return nextjsApp.handleRequest(req.req, reply.res).then(() => {
      reply.sent = true;
    });
  });

  fastify.setNotFoundHandler((request, reply) => {
    return nextjsApp.render404(request.req, reply.res).then(() => {
      reply.sent = true;
    });
  });
}
