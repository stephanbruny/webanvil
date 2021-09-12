const ioredis = require('ioredis');

module.exports = (config) => {
    const client = new ioredis(config);
    return {
        async set(key, value) {
            return client.set(key, JSON.stringify(value));
        },

        async get(key) {
            const result = await client.get(key);
            return JSON.parse(result);
        },

        async delete(key) {
            return client.del(key);
        },

        async findOne(search) {
            const keys = await client.keys(search);
            const result = await client.get(keys[0]);
            console.log("findOne", search, result)
            return JSON.parse(result);
        },

        async findAll(search) {
            const keys = await client.keys(search);
            const keyValues = await Promise.all(
                keys.map(async key => {
                    const value = await client.get(key);
                    return [key, JSON.parse(value)]
                })
            );
            return keyValues.reduce((acc, current) => {
                const [key, value] = current;
                return Object.assign(acc, { [key]: value });
            }, {});
        },
        
        async findKeys(search) {
            return client.keys(search);
        }
    }
};