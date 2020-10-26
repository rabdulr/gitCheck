const projects = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createProject, destroyProject} = require('../db')

projects.post('/createProjects', isLoggedIn, async (req, res, next) => {
    try {
        const {newCohort, projectList} = req.body;
        const {id:cohortId} = newCohort;
        const projectReturn = await Promise.all(projectList.map(project => createProject({cohortId, startDate: project.startDate, name: project.name})
        ))
        res.send(projectReturn);
    } catch (error) {
        throw error
    }
})

projects.delete('/deleteBatch', isLoggedIn, async (req, res, next) => {
    try {
        const {projects} = req.data
        const destroyResponse = await Promise.all(projects.map(project => destroyProject(project.id)))
        res.send(destroyResponse)
    } catch (error) {
        throw error
    }
})
module.exports = projects