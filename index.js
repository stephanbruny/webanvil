const fastify = require("fastify");
const Store = require('./lib/store');
const Redis = require('./lib/store/redis');
const Handlebars = require('handlebars');

const defaultTemplate = `
<!DOCTYPE html>
<html>
<head>
<title>{{title}}</title>
</head>
<body>

{{>article}}
{{{content}}}

</body>
</html>`;

const articlePartial = `<article>
    <h2>{{title}}</h2>
    <p>{{{content}}}</p>
</article>`

const Partials = (store, prefix = 'partial') => {
    const getKey = name => `${prefix}:${name}`;
    const keySearch = `${prefix}:*`;
    const setPartial = async (name, content) => {
        store.set(getKey(name), content);
    };
    
    const getPartial = async name => store.get(getKey(name));
    
    const getAllPartials = async () => store.findAll(keySearch);

    const registerAll = async () => {
        const keys = await store.findKeys(keySearch);
        await Promise.all(keys.map(async key => {
            const partial = await store.get(key);
            const partialName = key.replace(`${prefix}\:`, '');
            console.log(`Register partial ${partialName}`)
            Handlebars.registerPartial(partialName, Handlebars.compile(partial));
        }));
    };

    return {
        set: setPartial,
        get: getPartial,
        getPartialNames: async () => store.findKeys(`${prefix}:*`),
        getAll: getAllPartials,
        registerAll
    }
}


const renderTemplate = store => async (name, data = {}) => {
    const source = await store.get(name);
    const template = Handlebars.compile(source || defaultTemplate);
    return template(data);
}

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
    await store.set('foo', { hello: 'world foo' });
    await initializeRoutes(server, store);
    try {
        await server.listen(8080);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};
start();
