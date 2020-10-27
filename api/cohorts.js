const cohorts = require('express').Router();
const {isLoggedIn} = require('./utils');
const {createCohort, getCohortByCreatorId, getStudentsByCohortId, getProjectsByCohortId, destroyCohort} = require('../db')

cohorts.post('/createCohort', isLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.user;
        const {cohortName: name} = req.body
        const newCohort = await createCohort({id, name });
        res.send(newCohort)
    } catch (error) {
        throw error
    }
})

cohorts.get('/getAllCohorts', isLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.user;
        const cohorts = await getCohortByCreatorId(id)
        const cohortReturn = await Promise.all(cohorts.map(async cohort => {
            cohort.students = await getStudentsByCohortId(cohort.id);
            cohort.projects = await getProjectsByCohortId(cohort.id);
            return cohort
        }))
        res.send(cohortReturn)
    } catch (error) {
        throw error
    }
})

cohorts.delete('/delete/:id', isLoggedIn, async (req, res, next) => {
    try {
        const {id} = req.params;
        const cohort = await destroyCohort(id);
        res.sendStatus(200)
    } catch (error) {
        throw error
    }
})

module.exports = cohorts