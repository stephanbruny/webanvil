const Handlebars = require('handlebars');

module.exports = (store, prefix = 'partial') => {
    const getKey = name => `${prefix}:${name}`;
    const keySearch = `${prefix}:*`;
    const setPartial = async (name, content) => {
        Handlebars.parseWithoutProcessing(content); // Check syntax
        await store.set(getKey(name), content);
        return Handlebars.registerPartial(name, Handlebars.compile(content));
    };
    
    const getPartial = async name => store.get(getKey(name));
    
    const getAllPartials = async () => store.findAll(keySearch);

    const removePrefix = stringValue => stringValue.replace(`${prefix}\:`, '');

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
        getPartialNames: async (hidePrefix = true) => {
            const partialNames = await store.findKeys(`${prefix}:*`);
            if (!hidePrefix) return partialNames;
            return partialNames.map(removePrefix);
        },
        getAll: getAllPartials,
        registerAll
    }
}