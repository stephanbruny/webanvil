const assert = require('assert');

const checkImplementation = impl => {
    const expectedMethods = ['set', 'get', 'delete', 'findOne', 'findAll', 'findKeys'];
    expectedMethods.forEach(method => {
        assert.strictEqual(typeof impl[method], 'function', `Expected store method "${method}" (${typeof impl[method]})`);
    });
    return impl;
};

module.exports = implementation => {
    const memory = {};
    const impl = (implementation && checkImplementation(implementation)) || {
        set (key, value) {
            memory[key] = value;
        },
        get (key) {
            return memory[key];
        },
        delete (key) {
            delete memory[key];
        },
        findOne (search) {
            const key = Object.keys(memory).find(key => key.match(search));
            if (!key) return null;
            return memory[key];
        },
        findAll (search) {
            const keys = Object.keys(memory).filter(key => key.match(search));
            return keys.reduce((acc, current) => {
                const partial = { [current]: memory[current] };
                return Object.assign(acc, partial);
            }, {});
        },
        findKeys (search) {
            return Object.keys(memory).filter(key => key.match(search));
        }
    };

    return impl;
};