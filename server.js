const http = require('http');
const server = require('./route.js');
const port = process.env.PORT || 5000;
server.listen(port,  () => console.log(`Server running on port ${port}`))