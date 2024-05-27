
module.exports = {
    apps: [
      {
        name: "merncurd",
        script: "./dist/server.js",
        instances: "max",
        exec_mode: "cluster",
        env: {
          NODE_ENV: "development",
        },
        env_production: {
          NODE_ENV: "production",
          PORT:8000
        },
      },
    ],
  };