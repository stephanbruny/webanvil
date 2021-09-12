const assert = require('assert');
const ioredis = require('ioredis');

describe('Redis Store module', () => {
    before(function(next) {
        const client = new ioredis();
        client.on('ready', () => next());
        client.on('error', () => {
            console.warn('redis.spec.js was skipped due to Redis not being available');
            this.skip();
        })
    });

    beforeEach(function(next) {
        const client = new ioredis();
        client.flushdb().then(() => next());
    })

    it('should initialize and return API', () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();
        assert.strictEqual(typeof store.get, 'function');
        assert.strictEqual(typeof store.set, 'function');
        assert.strictEqual(typeof store.delete, 'function');
        assert.strictEqual(typeof store.findOne, 'function');
        assert.strictEqual(typeof store.findAll, 'function');
        assert.strictEqual(typeof store.findKeys, 'function');
    });

    it('should set and get a value for a specific key', async () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();

        await store.set('foo', { bar: 'baz' });
        await store.set('lol', 'rofl');
        await store.set('abc', 123);
        assert.deepStrictEqual(await store.get('foo'), { bar: 'baz' });
        assert.deepStrictEqual(await store.get('lol'), 'rofl');
        assert.deepStrictEqual(await store.get('abc'), 123);
    });

    it('should remove an item', async () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();

        await store.set('foo', { bar: 'baz' });
        assert.deepStrictEqual(await store.get('foo'), { bar: 'baz' });
        await store.delete('foo');
        assert(!(await store.get('foo')), `Expected item to be deleted`);
    });

    it('should find an item based on key search', async () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();

        await store.set('foo:bar', { bar: 'baz' });
        assert.deepStrictEqual(
            await store.findOne('foo:*'),
            {
                bar: 'baz'
            }
        );
    });

    it('should find multiple items based on key search', async () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();

        await store.set('foo:foo', { val: 'foo' });
        await store.set('foo:bar', { val: 'bar' });
        await store.set('foo:baz', { val: 'baz' });
        await store.set('nope', { no: true })
        const values = await store.findAll('foo:*');
        assert.deepStrictEqual(values, {
            'foo:foo': { val: 'foo' },
            'foo:bar': { val: 'bar' },
            'foo:baz': { val: 'baz' }
        });
    });

    it('should find multiple keys based on key search', async () => {
        const Store = require('../../../lib/store/redis');
        const store = Store();

        await store.set('foo:foo', { val: 'foo' });
        await store.set('foo:bar', { val: 'bar' });
        await store.set('foo:baz', { val: 'baz' });
        await store.set('nope', { no: true })
        const values = await store.findKeys('foo:*');
        assert.deepStrictEqual(values.sort(), [ 'foo:foo', 'foo:bar', 'foo:baz' ].sort());
    });
});