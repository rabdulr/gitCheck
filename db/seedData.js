const client = require('./client');
const { createUser, createCohort, createStudent, createProject} = require('./index')

async function dropTables() {
    console.log('Dropping All Tables...');
    try {
        await client.query(`
        DROP TABLE IF EXISTS projects;
        DROP TABLE IF EXISTS students;
        DROP TABLE IF EXISTS cohorts;
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

            CREATE TABLE cohorts(
                id SERIAL PRIMARY KEY,
                "creatorId" INTEGER REFERENCES users(id),
                "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                name VARCHAR(255) NOT NULL
            );

            CREATE TABLE students(
                id SERIAL PRIMARY KEY,
                "cohortId" INTEGER REFERENCES cohorts(id),
                "gitHubUser" VARCHAR(255) NOT NULL,
                "dateCreated" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE projects(
                id SERIAL PRIMARY KEY,
                "cohortId" INTEGER REFERENCES cohorts(id),
                name VARCHAR(255) NOT NULL,
                "startDate" DATE NOT NULL,
                "isForked" BOOLEAN NOT NULL
            )
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

async function createInitialCohorts() {
    console.log('Starting to create initial cohorts...');
    try {
        const cohortsToCreate = [
            {id: 1, name: 'Cohort One'},
            {id: 2, name: 'Cohort Two'}
        ];

        const cohorts = await Promise.all(cohortsToCreate.map(createCohort));
        console.log('Cohorts created: ');
        console.log(cohorts);
        console.log('Finished creating cohorts!');
    } catch (error) {
        console.log('Error creating cohorts!');
        throw error;
    }
}

async function createInitialStudents() {
    console.log('Starting to create initial students...');
    try {
       const studentsToCreate = [
           {cohortId: 1, gitHubUser: 'rabdulr'},
           {cohortId: 2, gitHubUser: 'wallacepreson'}
       ];
       const students = await Promise.all(studentsToCreate.map(createStudent))
       console.log('Students created: ');
       console.log(students);
       console.log('Finished creating students!');
    } catch (error) {
        console.log('Error creating students!');
        throw error
    }
}

async function createInitialProjects() {
    console.log('Starting to create initial projects...');
    try {
        const projectsToCreate = [
            {cohortId: 1, name: 'UNIV_Phenomena_Starter', startDate: '09/28/20', isForked: true},
            {cohortId: 2, name: 'UNIV_FitnessTrackr_Starter', startDate: '10/05/20', isForked: true}
        ];
        const projects = await Promise.all(projectsToCreate.map(createProject))
        console.log('Projects created: ');
        console.log(projects);
        console.log('Finished creating projects!')
    } catch (error) {
        console.log('Error creating projects!')
        throw error
    }
}
async function rebuildDB() {
    try {
        client.connect();
        await dropTables();
        await createTables();
        await createInitialUsers();
        await createInitialCohorts();
        await createInitialStudents();
        await createInitialProjects();
    } catch (error) {
        console.log('Error during rebuildDB');
        throw error;
    }
}

module.exports = {
    rebuildDB
}
