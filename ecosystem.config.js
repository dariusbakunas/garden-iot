module.exports = {
  apps : [{
    name: "garden-iot",
    script: 'build-server/index.js',
    watch: '.'
  }],

  deploy : {
    production : {
      'post-deploy' : 'pm2 reload ecosystem.config.js --env production',
    }
  }
};
