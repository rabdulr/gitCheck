const client = require('./client');

async function getAllProjects() {
    try {
        const {rows: projects} = await client.query(`
            SELECT * FROM projects
        `);
        return projects
    } catch (error) {
        throw error;
    }
}

async function getProjectById(projectId) {
    try {
        const {rows: [project]} = await client.query(`
            SELECT * FROM projects
            WHERE id=$1
        `, [projectId]);
        return project;
    } catch (error) {
        throw error;
    }
}

async function getProjectsByCohortId(cohortId) {
    try {
        const {rows: projects} = await client.query(`
            SELECT * FROM projects
            WHERE "cohortId"=$1
        `, [cohortId]);
        return projects;
    } catch (error) {
        throw error;
    }
}
async function createProject({cohortId, startDate, name, isForked}) {
    try {
        const {rows: [project]} = await client.query(`
            INSERT INTO projects("cohortId", "startDate", name, "isForked")
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `, [cohortId, startDate, name, isForked]);
        return project
    } catch (error) {
        throw error
    }
}

module.exports = {
    createProject,
    getAllProjects,
    getProjectById,
    getProjectsByCohortId
}