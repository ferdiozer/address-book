
/*
  _____                .___.__                             
  _/ ____\___________  __| _/|__|   ____________ ___________ 
  \   __\/ __ \_  __ \/ __ | |  |  /  _ \___   // __ \_  __ \
   |  | \  ___/|  | \/ /_/ | |  | (  <_> )    /\  ___/|  | \/
   |__|  \___  >__|  \____ | |__|  \____/_____ \\___  >__|   
             \/           \/                  \/    \/       
................................................ferdiozer.com
*/

const fastify = require('fastify')()
const { APP_PORT } = require('./config')

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

const start = async () => {
  try {
    console.log(new Date(), 'try to start')
    await fastify.listen(APP_PORT)
    console.log(new Date(), `server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    console.log('Could not start', err)
    process.exit(1)
  }
}
start()
