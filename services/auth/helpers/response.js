


const send_ok = (params, reply) => {
  let response = {
    ready: true
  }
  Object.assign(response, params)
  return reply.send(response)
}


const send_error = (params, reply) => {
  let response = {
    ready: false
  }
  Object.assign(response, params)
  return reply.send(response)
}



module.exports = {
  send_error,
  send_ok
}