import express from 'express';
import router from './router.js';

// Config
var port = 3000;
var hostname = 'localhost';

// Setup server with middleware.
const app = express();
// Enable CORS
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, Authorization, Content-Length, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/', router);

const server = app.listen({port,hostname}, () => {
    console.log("Server is runnning on port: " + port);
});

export default server;