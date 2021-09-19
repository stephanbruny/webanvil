const Handlebars = require('handlebars');
const Model = require('./model');

module.exports = (store, prefix = 'partial') => {
    const model = Model(store, prefix);
    const setPartial = async (name, content) => {
        Handlebars.parseWithoutProcessing(content); // Check syntax
        await model.set(name, content);
        return Handlebars.registerPartial(name, Handlebars.compile(content));
    };
    
    const getPartial = async name => model.get(name);
    
    const getAllPartials = async () => model.list();

    const registerAll = async () => {
        const keys = await model.keys(false);
        await Promise.all(keys.map(async key => {
            const partial = await model.get(key);
            console.log(`Register partial ${key}`)
            Handlebars.registerPartial(key, Handlebars.compile(partial));
        }));
    };

    return {
        set: setPartial,
        get: getPartial,
        getPartialNames: async (hidePrefix = true) => {
            return model.keys(!hidePrefix);
        },
        getAll: getAllPartials,
        registerAll
    }
}