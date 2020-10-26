const users = require('express').Router();
const {getUserByGitHubId} = require('../db');

users.get('/', async (req, res, next) => {
    try {
        if (req.user) {
            const {gitHubId} = req.user
            const user = await getUserByGitHubId(gitHubId);
            res.send({user});
        }
        next();
    } catch (error) {
        throw error
    }
})

module.exports = users

