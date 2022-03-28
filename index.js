var http = require('http');
const utf8 = require('utf8');

// require the new module
var handler = require('./handler');

var server = http.createServer(handler);

server.listen(8080);

