const assert = require('assert');
describe('Template module', () => {
    const Store = require('../../lib/store');
    it('should initialize and return an API', () => {
        const Template = require('../../lib/template');
        const template = Template(Store(), 'test-template');
        assert(template);
        assert.strictEqual(typeof template, 'object');
        assert.strictEqual(typeof template.set, 'function');
        assert.strictEqual(typeof template.get, 'function');
        assert.strictEqual(typeof template.render, 'function');
    });

    it('should render a template', async () => {
        const Template = require('../../lib/template');
        const template = Template(Store(), 'test-template');
        await template.set('foo', '<foo>{{text}}</foo>');
        const result = await template.render('foo', {
            text: 'Han shot first'
        });

        assert.strictEqual(result, '<foo>Han shot first</foo>');
    });

    it('should remove a template', async () => {
        const Template = require('../../lib/template');
        const template = Template(Store(), 'test-template');
        await template.set('foo', '<foo>{{text}}</foo>');
        const result = await template.render('foo', {
            text: 'Han shot first'
        });

        assert.strictEqual(result, '<foo>Han shot first</foo>');

        await template.remove('foo');
        assert.strictEqual(await template.render('foo'), null);
    });

    it('should list all template', async () => {
        const Template = require('../../lib/template');
        const template = Template(Store(), 'test-template');
        await template.set('foo', '<foo>{{text}}</foo>');
        await template.set('bar', '<bar>{{text}}</bar>');
        await template.set('baz', '<baz>{{text}}</baz>');
        const result = await template.getNames();

        assert.deepStrictEqual(result.sort(), ['foo', 'bar', 'baz'].sort());

        const templates = await template.list();

        assert.deepStrictEqual(templates, {
            "test-template:bar": "<bar>{{text}}</bar>",
            "test-template:baz": "<baz>{{text}}</baz>",
            "test-template:foo": "<foo>{{text}}</foo>"
        });
    });

});