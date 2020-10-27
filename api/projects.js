const projects = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createProject, destroyProject} = require('../db')

projects.post('/createProjects', isLoggedIn, async (req, res, next) => {
    try {
        const {cohortId, projectList} = req.body;
        const projectReturn = await Promise.all(projectList.map(project => createProject({cohortId, startDate: project.startDate, name: project.name})
        ))
        res.send(projectReturn);
    } catch (error) {
        throw error
    }
})

projects.post('/createProject', isLoggedIn, async (req, res, next) => {
    try {
        const {cohortId, newProject} = req.body;
        const projectReturn = await createProject({cohortId, startDate: newProject.startDate, name: newProject.name});
        res.send(projectReturn);
    } catch (error) {
        throw error
    }
})

projects.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params
        const destroyResponse = await destroyProject(id)
        res.send(destroyResponse)
    } catch (error) {
        throw error
    }
})
module.exports = projects