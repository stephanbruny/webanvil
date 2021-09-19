const fastify = require("fastify");
const Store = require('./lib/store');
const Redis = require('./lib/store/redis');
const Handlebars = require('handlebars');

const initializeRoutes = async (server, store) => {
    const render = renderTemplate(store);
    const partials = Partials(store);
    const partialItems = await partials.registerAll();

    server.get("/:id", async (request, reply) => {
        const result = await render(request.params.id, {
            title: 'Webanvil 1.0',
            content: 'No content'
        });
        return reply.type('text/html').send(result);
    });
}

const start = async () => {
    const server = fastify({ logger: true });
    const store = Store(Redis());
    await initializeRoutes(server, store);
    try {
        await server.listen(8080);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
