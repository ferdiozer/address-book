module.exports = function (fastify, opts, next) {
    fastify.get('/ok', async function (request, reply) {
      reply.send({
        ready: true,
        status: 'ok',
        params: request.params
      })
    })
    next()
  }