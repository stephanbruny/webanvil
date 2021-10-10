const { request } = require('undici');

module.exports = ({
    async get (url) {
        return request(url);
    },

    async post(url, jsonData) {
        return request(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        })
    }
});