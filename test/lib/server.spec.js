const assert = require('assert');
const axios = require('axios');

describe('Server module', () => {
    it('should start a web server', async () => {
        const Server = require('../../lib/server');
        const server = await Server();
        assert.strictEqual(typeof server, 'object');
        assert(server.server.address(), 'Expected HTTP Server');
        const address = server.server.address();
        const hostUrl = `http://${address.address}:${address.port}`;
    
        const result = await axios.get(hostUrl);
        assert(result);
        assert(result.data);
        assert(result.data.ok);

        const postResult = await axios({
            method: 'POST',
            url: `${hostUrl}/api/html/foo`,
            headers: { "Content-Type": "text/plain" },
            data: '<foo>{{text}}</foo>'
        });

        assert(postResult);
        assert(postResult.data.ok);

        const getResult = await axios.get(`${hostUrl}/api/html/foo`);

        assert.strictEqual(getResult.data, '<foo>{{text}}</foo>');

        const rendered = await axios.post(`${hostUrl}/html/foo`, {
            text: 'This but a test'
        });

        assert.strictEqual(rendered.data, '<foo>This but a test</foo>');

        // Partial rendering

        await axios({
            method: 'POST',
            url: `${hostUrl}/api/partial/test`,
            headers: { "Content-Type": "text/plain" },
            data: '<test>{{test.text}}</test>'
        });

        await axios({
            method: 'POST',
            url: `${hostUrl}/api/html/test`,
            headers: { "Content-Type": "text/plain" },
            data: '<page text="{{text}}">{{> test}}</page>'
        });
        const renderedWithPartial = await axios.post(`${hostUrl}/html/test`, {
            text: 'This but a test',
            test: {
                text: 'Foo Bar'
            }
        });

        assert.strictEqual(renderedWithPartial.data, '<page text="This but a test"><test>Foo Bar</test></page>')

    });
});