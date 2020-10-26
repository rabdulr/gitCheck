const students = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createStudent} = require('../db')

students.post('/createStudents', isLoggedIn, async (req, res, next) => {
    try {
        const {newCohort, studentsList} = req.body;
        const {id:cohortId} = newCohort;
        const studentReturn = await Promise.all(studentsList.map(gitHubUser => createStudent({cohortId, gitHubUser})))
        res.send(studentReturn)
    } catch (error) {
        throw error
    }
})

module.exports = students;
