const server = require('./server');

server({
    port: 8080
}).catch(error => console.error(error));