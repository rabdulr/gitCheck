require('dotenv').config();
const path = require('path');
const express = require('express');
const server = express();
const passport = require('passport');
const cookieSession = require('cookie-session');

const api = require('./api');


const bodyParser = require('body-parser');
server.use(bodyParser.json());

server.use('/dist', express.static(path.join(__dirname, 'dist')));
server.use('/assets', express.static(path.join(__dirname, 'assets')));

server.use(cookieSession({
    name: 'gitCheck-session',
    keys: ['key1', 'key2']
}))

server.get('/', (req, res, next) => res.sendFile(path.join(__dirname, 'index.html')));

server.use(passport.initialize());
server.use(passport.session())


server.use('/api/github', api.gitHub)
server.use('/api/users', api.users)

module.exports = {
    server
}
