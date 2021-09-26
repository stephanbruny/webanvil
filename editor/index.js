const fastify = require('fastify')({ logger: true });
const path = require('path');

const runtimeEnvironment = process.env.SERVICE_ENV || 'default';
const config = require(`./config.${runtimeEnvironment}.json`);

fastify.register(require('fastify-static'), {
  root: path.join(__dirname, 'build'),
  prefix: '/', // optional: default '/'
});

fastify
    .listen(config.port)
    .then(() => {
        console.log(`Service started (port: ${config.port})`)
    })
    .catch(err => console.error(err));