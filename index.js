const Server = require('./lib/server');
const RedisStore = require('./lib/store/redis');

const runtimeEnvironment = process.env.SERVICE_ENV || 'default';

const config = require(`./config.${runtimeEnvironment}.json`);
const pkg = require('./package.json');

const storeImplementation = config.store && config.store.redis ? RedisStore(config.store.redis) : null;

Server({
    port: config.port,
    store: storeImplementation
}).then(server => {
    console.log(`WebAnvil ${pkg.version} (${runtimeEnvironment} environment)`);
    console.log(`Service started (port: ${config.port})`)
}).catch(err => console.error(err));
