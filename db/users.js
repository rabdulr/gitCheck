const client = require('./client');

// DB Functions

// User functions, no delete option yet

async function createUser({username, accessToken, gitHubId}) {
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users(username, "accessToken", "gitHubId") 
            VALUES ($1, $2, $3)
            RETURNING *;
        `, [username, accessToken, gitHubId]);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByUsername(username) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users WHERE username=$1
        `, [username])
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserById(id) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users where id=$1
        `, [id]);
        return user;
    } catch (error) {
        throw error
    }
}

async function getUserByGitHubId(gitHubId) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * from users where "gitHubId"=$1
        `, [gitHubId]);
        return user;
    } catch (error) {
        throw error
    }
}

async function updateUserToken({id, accessToken}) {
    try {
        const {rows: [user]} = await client.query(`
            UPDATE users
            set "accessToken"=$1
            where id=$2
            RETURNING *;
        `, [accessToken, id]);
        return user
    } catch (error) {
        throw error;
    }
}

async function destroyStudent(studentId) {
    try {
        const {rows: [student]} = await client.query(`
            DELETE FROM students
            WHERE id=$1
            RETURNING *
        `, [studentId]);
        return student;
    } catch (error) {
        throw error
    }
}

module.exports = {
    createUser,
    getUserByUsername,
    getUserById,
    getUserByGitHubId,
    updateUserToken,
    destroyStudent
}
