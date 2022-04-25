
/*
  _____                .___.__                             
  _/ ____\___________  __| _/|__|   ____________ ___________ 
  \   __\/ __ \_  __ \/ __ | |  |  /  _ \___   // __ \_  __ \
   |  | \  ___/|  | \/ /_/ | |  | (  <_> )    /\  ___/|  | \/
   |__|  \___  >__|  \____ | |__|  \____/_____ \\___  >__|   
             \/           \/                  \/    \/       
................................................ferdiozer.com
*/

const fastify = require('fastify')({ logger: true })
const { APP_PORT, MONGO_DATABASE_URL } = require('./config')
const { swaggerFun } = require('./swagger')
const helmet = require('fastify-helmet')


const froutes = []
fastify.addHook('onRoute', (routeOptions) => {
  froutes.push({
    method: routeOptions.method,
    url: routeOptions.url,
    path: routeOptions.path,
    validation: routeOptions.attachValidation
  })
})

fastify.register(require('./lib/routes'), { prefix: '/api/v1' })

fastify.register(require('fastify-cors'), {
  origin: '*'
})


fastify.register(require("fastify-mongodb"), {
  forceClose: true,
  url: MONGO_DATABASE_URL,
});
/*
fastify.register(
  helmet,
  { hidePoweredBy: { setTo: 'PHP 8.0.18' } }
)
*/

swaggerFun(fastify)




fastify.get("/", function (req, reply) {
  reply.send("Hello, world!");
});

fastify.listen(APP_PORT, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`server listening on ${address}`);

});


