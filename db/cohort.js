const client = require('./client');

async function createCohort({id, name}) {
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

async function getCohortByCreatorId(creatorId) {
    try {
        const {rows: cohorts} = await client.query(`
            SELECT * from cohorts
            WHERE "creatorId"=$1
        `, [creatorId]);
        return cohorts
    } catch (error) {
        throw error
    }
}

async function updateCohortName({id, name}) {
    try {
        const {rows: [cohort]} = await client.query(`
            UPDATE cohorts
            set name=$1
            where id=$2
            RETURNING *;
        `, [name, id]);
        return cohort
    } catch (error) {
        throw error;
    }
}

async function destroyCohort(id) {
    try {
        await client.query(`
            DELETE FROM students
            WHERE "cohortId"=$1
        `, [id]);
        await client.query(`
            DELETE FROM projects
            WHERE "cohortId"=$1
        `, [id]);
        const {rows: [cohort]} = await client.query(`
            DELETE FROM cohorts
            WHERE id=$1
            RETURNING *
        `, [id]);
        return cohort
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createCohort,
    getAllCohorts,
    getCohortById,
    getCohortByCreatorId,
    updateCohortName,
    destroyCohort
}