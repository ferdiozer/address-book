
const { appKey } = require('./main.config')

module.exports = {
  apps: [
    {
      name: `${appKey}-main`,
      script: "./services/main/index.js"
    },
    {
      name: `${appKey}-auth`,
      script: "./services/auth/index.js"
    }
  ]
}