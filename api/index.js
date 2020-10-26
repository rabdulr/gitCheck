const api = require('express').Router();
const users = require('./users');
const github = require('./github');
const cohorts = require('./cohorts');
const students = require('./students');
const projects = require('./projects')

api.use('/github', github);
api.use('/users', users);
api.use('/cohorts', cohorts);
api.use('/students', students)
api.use('/projects', projects)

module.exports = api
