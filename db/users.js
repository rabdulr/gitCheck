const client = require('./client');

// DB Functions

// User functions, no delete option yet

async function createUser({login, accessToken}) {
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users(login, "accessToken") 
            VALUES ($1, $2)
            RETURNING *;
        `, [login, accessToken]);
        return user;
    } catch (error) {
        throw error;
    }
}

async function getUserByLogin(login) {
    try {
        const {rows: [user]} = await client.query(`
            SELECT * FROM users WHERE login=$1
        `, [login])
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
    getUserByLogin,
    getUserById,
    updateUserToken,
    destroyStudent
}
