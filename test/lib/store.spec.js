const assert = require('assert');
describe('Store module', () => {
    it('should initialize and return API', () => {
        const Store = require('../../lib/store');
        const store = Store();
        assert.strictEqual(typeof store.get, 'function');
        assert.strictEqual(typeof store.set, 'function');
        assert.strictEqual(typeof store.delete, 'function');
        assert.strictEqual(typeof store.findOne, 'function');
        assert.strictEqual(typeof store.findAll, 'function');
        assert.strictEqual(typeof store.findKeys, 'function');
    });

    it('should set and get a value for a specific key', () => {
        const Store = require('../../lib/store');
        const store = Store();

        store.set('foo', { bar: 'baz' });
        store.set('lol', 'rofl');
        store.set('abc', 123);
        assert.deepStrictEqual(store.get('foo'), { bar: 'baz' });
        assert.deepStrictEqual(store.get('lol'), 'rofl');
        assert.deepStrictEqual(store.get('abc'), 123);
    });

    it('should remove an item', () => {
        const Store = require('../../lib/store');
        const store = Store();

        store.set('foo', { bar: 'baz' });
        assert.deepStrictEqual(store.get('foo'), { bar: 'baz' });
        store.delete('foo');
        assert(!store.get('foo'), `Expected item to be deleted`);
    });

    it('should find an item based on key search', () => {
        const Store = require('../../lib/store');
        const store = Store();

        store.set('foo:bar', { bar: 'baz' });
        assert.deepStrictEqual(
            store.findOne(/foo\:/),
            {
                bar: 'baz'
            }
        );
    });

    it('should find multiple items based on key search', () => {
        const Store = require('../../lib/store');
        const store = Store();

        store.set('foo:foo', { val: 'foo' });
        store.set('foo:bar', { val: 'bar' });
        store.set('foo:baz', { val: 'baz' });
        store.set('nope', { no: true })
        const values = store.findAll('foo\:*');
        assert.deepStrictEqual(values, {
            'foo:foo': { val: 'foo' },
            'foo:bar': { val: 'bar' },
            'foo:baz': { val: 'baz' }
        });
    });

    it('should find multiple keys based on key search', () => {
        const Store = require('../../lib/store');
        const store = Store();

        store.set('foo:foo', { val: 'foo' });
        store.set('foo:bar', { val: 'bar' });
        store.set('foo:baz', { val: 'baz' });
        store.set('nope', { no: true })
        const values = store.findKeys('foo\:*');
        assert.deepStrictEqual(values, [ 'foo:foo', 'foo:bar', 'foo:baz' ]);
    });
});