const api = require('express').Router();
const users = require('./users');
const github = require('./github')

api.use((req, res, next) => {
    console.log('API REQ USER: ', req.user)
    next();
})

api.use('/github', github);
api.use('/users', users)

module.exports = api