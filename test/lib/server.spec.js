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
    });
});