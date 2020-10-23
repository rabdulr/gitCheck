const client = require('./client');

async function createStudent({gitHubUser, cohortId}) {
    try {
        const {rows: [student]} = await client.query(`
            INSERT INTO students("cohortId", "gitHubUser")
            VALUES ($1, $2)
            RETURNING *
        `, [cohortId, gitHubUser]);
        return student
    } catch (error) {
        throw error
    }
}

async function getAllStudents() {
    try {
        const {rows: students} = await client.query(`
            SELECT * FROM students
        `);
        return students
    } catch (error) {
        throw error
    }
}

async function getStudentById(id) {
    try {
        const {rows: [student]} = await client.query(`
            SELECT * FROM students
            WHERE id=$1
        `, [id]);
        return student
    } catch (error) {
        throw error
    }
}

async function getStudentsByCohortId(cohortId) {
    try {
        const {rows: students} = await client.query(`
            SELECT * FROM students
            where "cohortId"=$1
        `, [cohortId]);
        return students
    } catch (error) {
        throw error
    }
}

module.exports = {
    createStudent,
    getAllStudents,
    getStudentById,
    getStudentsByCohortId
}
