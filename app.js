require('dotenv').config();
const path = require('path');
const express = require('express');
const server = express();
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./api/passport-setup');
const cors = require('cors')

const api = require('./api');

const bodyParser = require('body-parser');
server.use(cors())
server.use(bodyParser.json());

server.use('/dist', express.static(path.join(__dirname, 'dist')));
server.use('/assets', express.static(path.join(__dirname, 'assets')));

server.use(cookieSession({
    name: 'gitCheck-session',
    keys: ['key1', 'key2']
}))

server.get('/', (req, res, next) => res.sendFile(path.resolve(__dirname, 'index.html')));

server.use(passport.initialize());
server.use(passport.session())

server.get('/auth/github/login', passport.authenticate('github', { scope: ['repo', 'read:user']}));
server.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/'}),
    function(req, res) {
        res.redirect(`/`)
});

server.get('/auth/github/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/')
})

server.use('/api', api);

server.use((err, req, res, next) => {
    res.send({message: err.message})
})
module.exports = {
    server
}
