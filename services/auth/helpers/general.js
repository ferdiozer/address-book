
const mb = (...p) => o => p.map(c => o = (o || {})[c]) && o
const mb_ip = mb('headers', 'x-forwarded-for')
const mb_ip_cf = mb('headers', 'cf-connecting-ip')


const getIp = (request) => {
  let ip = mb_ip(request)
  ip = (ip || '').toString().split(',')[0] || mb_ip_cf(request)
  return ip
}

const clean_object = n => JSON.parse(JSON.stringify(n))

const checkParams = (props, body) => {
  return props.reduce(function (i, j) { return i && j in body }, true);
}





module.exports = {
  getIp,
  checkParams
}
