const { rebuildDB } = require('../db/seedData');
const { createUser, getUserByEmail, getUserById, updateUserToken, getAllCohorts, createCohort, getCohortById } = require('../db');
const client = require('../db/client');

describe('Database', () => {
    beforeAll(async() => {
        await rebuildDB();
    })
    describe('Users', () => {
        let userToCreateAndUpdate, queriedUser;
        let userCredentials = {email: 'jest@gitcheck.com', accessToken: '1234abcd'};
        describe('createUser({email, accessToken})', () => {
            beforeAll( async() => {
                userToCreateAndUpdate = await createUser(userCredentials);
                const {rows} = await client.query(`SELECT * FROM users where email=$1`, [userCredentials.email]);
                queriedUser = rows[0];
            })
            it('Creates the user', () => {
                expect(userToCreateAndUpdate.email).toBe(userCredentials.email);
                expect(queriedUser.email).toBe(userCredentials.email);
            })
        })
        describe('getUserByEmail(email)', () => {
            it('Retrieves the user by email', async () => {
                const retrievedUser = await getUserByEmail(userCredentials.email);
                expect(retrievedUser).toStrictEqual(userToCreateAndUpdate);
            })
        })
        describe('getUserById(id)', () => {
            it('Retries the user by id', async () => {
                const retrievedUser = await getUserById(userToCreateAndUpdate.id);
                expect(retrievedUser).toBeTruthy()
            })
        })
        describe('updateUserToken({id, accessToken})', () => {
            let updatedInfo
            let newToken = 'abcd1234';
            beforeAll( async() => {
                userToCreateAndUpdate.accessToken = newToken;
                updatedInfo = await updateUserToken(userToCreateAndUpdate);
            })
            it('Updates the user', () => {
                expect(userToCreateAndUpdate.accessToken).toBe(updatedInfo.accessToken);
            })
        })
    })
    describe('Cohorts', () => {
        describe('getAllCohorts', () => {
            it('Selects and returns an array of cohorts', async () => {
                const cohorts = await getAllCohorts();
                const {rows: cohortsFromDB} = await client.query(`SELECT * FROM cohorts`);
                expect(cohorts).toEqual(cohortsFromDB)
            })
        })
        describe('createCohort({id, name}), getCohortById(id)', () => {
            let newCohort
            it('Creates and returns a new cohort item, verifieds by ID', async () => {
                newCohort = await createCohort({id: 1, name: 'Cohort Three'});
                const verifyCohort = await getCohortById(newCohort.id);
                expect(newCohort).toBeTruthy();
                expect(newCohort).toStrictEqual(verifyCohort)
            })
        })
    })
})
