const fastify = require("fastify");
const axios = require('axios');

const contentService = 'http://localhost:1337';
const renderService = 'http://localhost:8300';

const renderUrl = (path) => `${renderService}/${path}`;
const contentUrl = (path, sep = '/') => `${contentService}${sep}${path}`;


const getJson = async url => {
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (ex) {
        console.error("Error (getJson)", url, ex.message);
    }
};

const getContentJson = path => getJson(contentUrl(path));

const render = async (path, data = {}) => {
    const res = await axios.post(renderUrl(path), data);
    return res.data;
}

const content = {
    homepage: async () => getContentJson('homepage'),
    categories: async () => getContentJson('categories'),
    category: async (id) => getContentJson(`categories/${id}`),
    articles: async () => getContentJson('articles'),
    article: async (id) => getContentJson(`articles/${id}`)
};

const routes = {
    '/': {
        render: 'html/Main',
        data: {
            homepage: 'homepage',
            cateogories: 'categories'
        }
    }
};

const initializeRoutes = async (server) => {
    server.get('/', async (req, rep) => {
        const homepage = await content.homepage();
        const categories = await content.categories();
        const result = await render('html/Main', {
            homepage,
            categories
        })
        rep.type('text/html').send(result);
    });  

    server.get('/content/*', async (req, rep) => {
        const res = await axios.get(contentUrl(req.params['*']), {
            responseType: 'arraybuffer'
        });
        rep.type(res.headers['content-type']).send(res.data)
    })
}

module.exports = async (config = {}) => {
    const server = fastify({ logger: false });
    await initializeRoutes(server);
    try {
        await server.listen(config.port || 8080);
        return server;
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
}
