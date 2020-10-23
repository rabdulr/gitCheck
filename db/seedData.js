const client = require('./client');
const { createUser, updateUserToken } = require('./index')

async function dropTables() {
    console.log('Dropping All Tables...');
    try {
        await client.query(`
        DROP TABLE IF EXISTS users;
        `)
    } catch (error) {
        throw error;
    }
}

async function createTables() {
    try {
        console.log('Building tables...');
        await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                "accessToken" VARCHAR(255)
            );
        `);
        console.log('Finished building tables...')
    } catch (error) {
        throw error;
    }
}

// Building seed data for testing DB

async function createInitialUsers() {
    console.log('Starting to create users...');
    try {
        const usersToCreate = [
            {email: 'admin@gitcheck.com', accessToken: '1234abcd'},
            {email: 'red@gitcheck.com', accessToken: '1234abcd'}
        ];

        const users = await Promise.all(usersToCreate.map(createUser));
        console.log('Users created: ');
        console.log(users);
        console.log('Finished creating users!')
    } catch (error) {
        console.log('Error creating users!');
        throw error;
    }
}

async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    }
}

module.exports = {
    rebuildDB
}
