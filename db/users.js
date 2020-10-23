const client = require('./client');

// DB Functions

// User functions

async function createUser({email, accessToken}) {
    try {
        const {rows: [user]} = await client.query(`
            INSERT INTO users(email, "accessToken") VALUES ($1, $2)
            RETURNING *;
        `, [email, accessToken]);
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

module.exports = {
    createUser,
    updateUserToken
}
