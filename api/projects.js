const projects = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createProject} = require('../db')

projects.post('/createProjects', isLoggedIn, async (req, res, next) => {
    try {
        const {newCohort, projectList} = req.body;
        const {id:cohortId} = newCohort;
        const projectReturn = await Promise.all(projectList.map(project => createProject({cohortId, startDate: project.date, name: project.name})
        ))
        res.send(projectReturn);
    } catch (error) {
        throw error
    }
})

module.exports = projects