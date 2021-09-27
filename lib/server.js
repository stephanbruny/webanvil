const fastify = require("fastify");
const Store = require('./store');
const Template = require('./template');
const Partials = require('./partials');

const initializeRoutes = async (server, store) => {
    const template = Template(store);
    const partials = Partials(store);

    server.get("/", async (request, reply) => {
        return reply.type('application/json').send({
            ok: true
        });
    });

    server.get('/api/html/:id', async (req, rep) => {
        const result = await template.get(req.params.id);
        if (!result) 
            return rep
                .status(404)
                .type('application/json')
                .send({ error: 'Template not found', id: req.params.id });
        return rep.header('Access-Control-Allow-Origin', '*').type('text/x-handlebars').send(result);
    });

    server.get('/api/html', async (req, rep) => {
        const result = await template.getNames();
        if (!result) 
            return rep
                .status(404)
                .type('application/json')
                .send({ error: 'Template not found', id: req.params.id });
        return rep.header('Access-Control-Allow-Origin', '*').type('application/json').send(result);
    });

    server.get('/api/partial/:id', async (req, rep) => {
        const result = await partials.get(req.params.id);
        if (!result) 
            return rep
                .status(404)
                .type('application/json')
                .send({ error: 'Partial not found', id: req.params.id });
        return rep.type('text/x-handlebars').send(result);
    });

    server.get('/api/partial', async (req, rep) => {
        const result = await partials.list();
        if (!result) 
            return rep
                .status(404)
                .type('application/json')
                .send({ error: 'Template not found', id: req.params.id });
        return rep.header('Access-Control-Allow-Origin', '*').type('application/json').send(result);
    });

    server.post('/api/html/:id', async (req, rep) => {
        try {
            await template.set(req.params.id, req.body);
            return rep
                .type('application/json')
                .header('Access-Control-Allow-Origin', '*')
                .send({ ok: true, id: req.params.id });
        } catch (ex) {
            return rep.status(400).type('application/json').send({
                error: ex.message
            });
        }
    });

    server.post('/api/partial/:id', async (req, rep) => {
        try {
            await partials.set(req.params.id, req.body);
            return rep
                .type('application/json')
                .header('Access-Control-Allow-Origin', '*')
                .send({ ok: true, id: req.params.id });
        } catch (ex) {
            return rep.status(400).type('application/json').send({
                error: ex.message
            });
        }
    });

    server.post('/html/:id', async (req, rep) => {
        try {
            const result = await template.render(req.params.id, req.body);
            return rep
                .type('text/html')
                .header('Access-Control-Allow-Origin', '*')
                .send(result);
        } catch (ex) {
            return rep.status(400).type('application/json').send({
                error: ex.message
            });
        }
    });
}

module.exports = async (config = {}) => {
    const server = fastify({ logger: true });
    const storeImplementation = config.store; // Redis();
    const store = Store(storeImplementation);
    await initializeRoutes(server, store);
    try {
        await server.listen(config.port);
        return server;
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
