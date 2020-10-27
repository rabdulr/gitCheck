const students = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createStudent, destroyStudentById} = require('../db')

students.post('/createStudents', isLoggedIn, async (req, res, next) => {
    try {
        const {cohortId, studentList} = req.body;
        const studentReturn = await Promise.all(studentList.map(gitHubUser => createStudent({cohortId, gitHubUser})))
        res.send(studentReturn)
    } catch (error) {
        throw error
    }
});

students.post('/createStudent', isLoggedIn, async (req, res, next) => {
    try {
        const {cohortId, username: gitHubUser} = req.body;
        const studentReturn = await createStudent({cohortId, gitHubUser});
        res.send(studentReturn)
    } catch (error) {
        throw error
    }
})

students.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params
        console.log('id: ', id)
        const destroyResponse = await destroyStudentById(id)
        res.send(destroyResponse)
    } catch (error) {
        throw error
    }
})

module.exports = students;
