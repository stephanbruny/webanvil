const assert = require('assert');

describe('Model module', () => {
    const Store = require('../../lib/store');
    it('should initialize and return API', () => {
        const Model = require('../../lib/model');
        const model = Model(Store(), 'test');
        assert.strictEqual(typeof model.get, 'function');
        assert.strictEqual(typeof model.set, 'function');
        assert.strictEqual(typeof model.keys, 'function');
        assert.strictEqual(typeof model.list, 'function');
        assert.strictEqual(typeof model.remove, 'function');
    });

    it('should NOT initialize with missing store or prefix', () => {
        const Model = require('../../lib/model');
        assert.throws(() => {
            Model();
        });

        assert.throws(() => {
            Model(Store());
        });

        assert.throws(() => {
            Model(null, 'foo');
        });
    });

    it('should set and get values', async () => {
        const Model = require('../../lib/model');
        const model = Model(Store(), 'test');
        await model.set('foo', { foo: 42 });
        const result = await model.get('foo');
        assert.deepStrictEqual(result, { foo: 42 });
    });

    it('should list all keys', async () => {
        const Model = require('../../lib/model');
        const model = Model(Store(), 'test');
        await model.set('foo', { foo: 42 });
        await model.set('bar', { bar: 42 });
        await model.set('baz', { baz: 42 });

        const result = await model.keys();
        assert.deepStrictEqual(result.sort(), ['test:foo', 'test:bar', 'test:baz'].sort());

        const resultNoPrefix = await model.keys(false);
        assert.deepStrictEqual(resultNoPrefix.sort(), ['foo', 'bar', 'baz'].sort());
    });

    it('should list all items', async () => {
        const Model = require('../../lib/model');
        const model = Model(Store(), 'test');
        await model.set('foo', { foo: 42 });
        await model.set('bar', { bar: 42 });
        await model.set('baz', { baz: 42 });

        const result = await model.list();
        assert.deepStrictEqual(result, {
            'test:foo': { foo: 42 },
            'test:bar': { bar: 42 },
            'test:baz': { baz: 42 }
        });
    });

    it('should remove an items', async () => {
        const Model = require('../../lib/model');
        const model = Model(Store(), 'test');
        await model.set('foo', { foo: 42 });
        await model.set('bar', { bar: 42 });
        await model.set('baz', { baz: 42 });

        const result = await model.list();
        assert.deepStrictEqual(result, {
            'test:foo': { foo: 42 },
            'test:bar': { bar: 42 },
            'test:baz': { baz: 42 }
        });

        await model.remove('bar');

        const resultAfterRemove = await model.list();
        assert.deepStrictEqual(resultAfterRemove, {
            'test:foo': { foo: 42 },
            'test:baz': { baz: 42 }
        });
    });
});