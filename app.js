require('dotenv').config();
const path = require('path');
const express = require('express');
const server = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./api/passport-setup');

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

server.get('/auth/github/login', passport.authenticate('github', { scope: ['user', 'profile']}));
server.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
        res.redirect(`/`)
});
server.get('/auth/github/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/')
})

server.use('/api', api)

module.exports = {
    server
}
