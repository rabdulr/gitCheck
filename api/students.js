const students = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createStudent, destroyStudentById} = require('../db')

students.post('/createStudents', isLoggedIn, async (req, res, next) => {
    try {
        const {newCohort, studentListArr} = req.body;
        const {id:cohortId} = newCohort;
        const studentReturn = await Promise.all(studentListArr.map(gitHubUser => createStudent({cohortId, gitHubUser})))
        res.send(studentReturn)
    } catch (error) {
        throw error
    }
});

students.delete('/deleteBatch', isLoggedIn, async (req, res, next) => {
    try {
        console.log('req data: ', req)
        const {students} = req.data
        const destroyResponse = await Promise.all(students.map(student => destroyStudentById(student.id)))
        res.send(destroyResponse)
    } catch (error) {
        throw error
    }
})

module.exports = students;
