const users = require('express').Router();
const {getUserByGitHubId} = require('../db');

users.get('/', async (req, res, next) => {
    const gitHubId = req.user
    try {
        const user = await getUserByGitHubId(gitHubId);
        res.send({user});
    } catch (error) {
        throw error
    }
})

module.exports = {
    users
}

