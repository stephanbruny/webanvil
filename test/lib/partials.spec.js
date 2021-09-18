const Handlebars = require('handlebars');
const assert = require('assert');

describe('Partials module', () => {
    const Store = require('../../lib/store');
    it('should initialize and return API', () => {
        const Partials = require('../../lib/partials');
        const partials = Partials(Store());
        assert.strictEqual(typeof partials.get, 'function');
        assert.strictEqual(typeof partials.set, 'function');
        assert.strictEqual(typeof partials.getPartialNames, 'function');
        assert.strictEqual(typeof partials.getAll, 'function');
        assert.strictEqual(typeof partials.registerAll, 'function');
    });

    it('should register a partial', async () => {
        const Partials = require('../../lib/partials');
        const partials = Partials(Store());

        const testPartial = `<p>{{text}} - test</p>`;

        await partials.set('test', testPartial);
        
        assert.strictEqual(await partials.get('test'), testPartial);
        assert(Handlebars.partials.test);

        await assert.rejects(async () => {
            await partials.set('test-broken', `<foo>{{asdf}</foo>`);
        }, `Expected invalid syntax partial to reject`);
    });

    it('should list all registered partials', async () => {
        const Partials = require('../../lib/partials');
        const partials = Partials(Store());

        const fooPartial = `<foo>{{foo}}</foo>`;
        const barPartial = `<bar>{{bar}}</bar>`;
        const bazPartial = `<baz>{{baz}}</baz>`;

        await partials.set('foo', fooPartial);
        await partials.set('bar', barPartial);
        await partials.set('baz', bazPartial);
        
        const all = await partials.getPartialNames();
        assert.deepStrictEqual(all.sort(), ['foo', 'bar', 'baz'].sort());
        const allPrefixed = await partials.getPartialNames(false);
        assert.deepStrictEqual(allPrefixed.sort(), ['partial:foo', 'partial:bar', 'partial:baz'].sort());

        const allPartials = await partials.getAll();
        assert.deepStrictEqual(allPartials, {
            'partial:foo': fooPartial,
            'partial:bar': barPartial,
            'partial:baz': bazPartial
        });

        await assert.doesNotReject(async () => {
            await partials.registerAll();
        }, 'Expected to resolve registering all partials');
    });
});