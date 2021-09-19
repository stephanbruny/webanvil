const fastify = require("fastify");
const Store = require('./store');
const Redis = require('./store/redis');
const Template = require('./template');
const Partials = require('./partials');

const initializeRoutes = async (server, store) => {
    server.get("/", async (request, reply) => {
        return reply.type('application/json').send({
            ok: true
        });
    });
}

module.exports = async (config = {}) => {
    const server = fastify({ logger: true });
    const store = Store(Redis());
    await initializeRoutes(server, store);
    try {
        await server.listen(config.port);
        return server;
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
