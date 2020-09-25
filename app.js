require('dotenv').config();
const path = require('path');
const express = require('express');
const server = express();
const api = require('./api');

const bodyParser = require('body-parser');
server.use(bodyParser.json());

server.use('/dist', express.static(path.join(__dirname, 'dist')));
server.use('/assets', express.static(path.join(__dirname, 'assets')));

server.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

server.use('/api/github', api.gitRouter.router)

module.exports = {
    server
};