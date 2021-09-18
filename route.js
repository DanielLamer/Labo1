const http = require("http");
const url = require("url");
module.exports = http.createServer((req,res) => {
    var mathOps = require('./controller.js');
    const reqUrl = url.parse(req.url, true);
    
    if (reqUrl.pathname == '/api/maths' && req.method === 'GET'){
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        mathOps.getResult(req, res);
    } 
     else {
        console.log('Request type: ' + req.method + ' Endpoint: ' + req.url);
        mathOps.invalidUrl(req, res);
    }
})