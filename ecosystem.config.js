module.exports = {
  apps: [{
    name: "VeganNearby",
    script: "./app.js",
    watch: true,
    env: {
      "NODE_ENV": "development"
    },
    env_production: {
      "PORT": 80,
      "NODE_ENV": "production",
      "CLIENT_URL": "http://vegannearby.com"
    }
  }]
}