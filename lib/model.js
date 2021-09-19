/**
 * Model abstracts namespace / prefix handling over store
 * @param {object | Store} store instance of store
 * @param {string} prefix prefix (namespace)
 * @returns { Model }
 */
module.exports = (store, prefix) => {
    if (!store) throw new Error('Cannot initialize model without store');
    if (!prefix) throw new Error('Cannot initialize model without prefix');
    const keySearch = `${prefix}:*`;
    const getKey = name => `${prefix}:${name}`;
    const removePrefix = stringValue => stringValue.replace(`${prefix}\:`, '');
    return {
        async set (key, value) {
            return store.set(getKey(key), value);
        },
        async get (key) {
            return store.get(getKey(key));
        },
        async keys (includePrefix = true) {
            const result = await store.findKeys(keySearch);
            if (includePrefix) return result;
            return result.map(removePrefix);
        },
        async list () {
            return store.findAll(keySearch);
        },
        async remove (key) {
            return store.delete(getKey(key));
        }
    };
};