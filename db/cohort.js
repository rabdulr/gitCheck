const client = require('./client');

async function createCohort(cohortInfo) {
    const {id, name} = cohortInfo;
    try {
        const {rows: [cohort]} = await client.query(`
            INSERT INTO cohorts("creatorId", name)
            VALUES($1, $2)
            RETURNING *
        `, [id, name])
        return cohort
    } catch (error) {
        throw error
    }
}

async function getAllCohorts() {
    try {
        const {rows: cohorts} = await client.query(`
            SELECT * FROM cohorts
        `)
        return cohorts
    } catch (error) {
        throw error
    }
}

async function getCohortById(id) {
    try {
        const {rows: [cohort]} = await client.query(`
            SELECT * from cohorts
            WHERE id=$1
        `, [id]);
        return cohort
    } catch (error) {
        throw error
    }
}

async function getCohortByCreatorId(id) {
    try {
        const {rows: cohorts} = await client.query(`
            SELECT * from cohorts
            WHERE "creatorId"=$1
        `, [id]);
        return cohorts
    } catch (error) {
        throw error
    }
}

module.exports = {
    createCohort,
    getAllCohorts,
    getCohortById,
    getCohortByCreatorId
}