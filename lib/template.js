const { template } = require('handlebars');
const Handlebars = require('handlebars');

const Model = require('./model');

module.exports = (store, prefix = 'template') => {
    const model = Model(store, prefix);    
    const templateCache = {};
    const revokeCache = name => delete templateCache[name];
    return {
        async set (name, markup) {
            if (templateCache[name]) revokeCache(name); // Revoke cache
            return model.set(name, markup);
        },
        async get (name) {
            return model.get(name);
        },
        async render (name, context) {
            if (!templateCache[name]) {
                const markup = await model.get(name);
                if (!markup) return null;
                const template = Handlebars.compile(markup);
                templateCache[name] = template;
            }
            return templateCache[name](context);
        },
        async remove (name) {
            revokeCache(name);
            return model.remove(name);
        },
        async list () {
            return model.list();
        },
        async getNames () {
            return model.keys(false);
        }
    };
};