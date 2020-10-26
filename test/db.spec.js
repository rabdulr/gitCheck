const { rebuildDB } = require('../db/seedData');
const { createUser, getUserByUsername, getUserById, getUserByGitHubId, updateUserToken, getAllCohorts, createCohort, getCohortById, updateCohortName, destroyCohort, createStudent, getAllStudents, getStudentById, getStudentsByCohortId, destroyStudentById, getAllProjects, getProjectById, createProject, getProjectsByCohortId, destroyProject, destroyStudentById } = require('../db');
const client = require('../db/client');

describe('Database', () => {
    beforeAll(async() => {
        await rebuildDB();
    })
    describe('Users', () => {
        let userToCreateAndUpdate, queriedUser;
        let userCredentials = {username: 'jest@gitcheck.com', accessToken: '1234abcd', gitHubId: '6453'};
        describe('createUser({username, accessToken, gitHubId})', () => {
            beforeAll( async() => {
                userToCreateAndUpdate = await createUser(userCredentials);
                const {rows} = await client.query(`SELECT * FROM users where username=$1`, [userCredentials.username]);
                queriedUser = rows[0];
            })
            it('Creates the user', () => {
                expect(userToCreateAndUpdate.username).toBe(userCredentials.username);
                expect(queriedUser.username).toBe(userCredentials.username);
            })
        })
        describe('getUserByusername(username)', () => {
            it('Retrieves the user by username', async () => {
                const retrievedUser = await getUserByUsername(userCredentials.username);
                expect(retrievedUser).toStrictEqual(userToCreateAndUpdate);
            })
        })
        describe('getUserById(id)', () => {
            it('Retrieves the user by id', async () => {
                const retrievedUser = await getUserById(userToCreateAndUpdate.id);
                expect(retrievedUser).toBeTruthy()
            })
        })
        describe('getUserByGitHubId(id)', () => {
            it('Retrieves the user by GitHub id', async () => {
                const retrievedUser = await getUserByGitHubId(userToCreateAndUpdate.gitHubId);
                expect(retrievedUser.gitHubId).toBe(userToCreateAndUpdate.gitHubId)
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
        let newCohort
        describe('getAllCohorts', () => {
            it('Selects and returns an array of cohorts', async() => {
                const cohorts = await getAllCohorts();
                const {rows: cohortsFromDB} = await client.query(`SELECT * FROM cohorts`);
                expect(cohorts).toEqual(cohortsFromDB)
            })
        })
        describe('createCohort({id, name}), getCohortById(id)', () => {
            it('Creates and returns a new cohort item', async() => {
                newCohort = await createCohort({id: 1, name: 'Cohort Three'});
                expect(newCohort).toBeTruthy();
            })
            it('Verifies cohort created by ID', async() => {
                const verifyCohort = await getCohortById(newCohort.id);
                expect(newCohort).toStrictEqual(verifyCohort)
            })
        })
        describe('updateCohortName({id, name})', () => {
            it('Updates the name of the cohort', async() => {
                newCohort = await updateCohortName({id: newCohort.id, name: 'Sour Patch Kids'})
                const updatedCohort = await getCohortById(newCohort.id);
                expect(newCohort.name).toEqual(updatedCohort.name)
            })
        })
        describe('destroyCohort(id)', () => {
            it('Destroys a cohort by cohort ID including projects and students', async() => {
                await destroyCohort(newCohort.id);
                const {rows: [destroyedCohort]} = await client.query(`
                    SELECT * FROM cohorts
                    WHERE id=$1
                `, [newCohort.id])
                expect(destroyedCohort).toBeFalsy();
            })
        })
    })
    describe('Students', () => {
        let student
        describe('getAllStudents', () => {
            it('Selects and returns an array of students', async () => {
                const students = await getAllStudents();
                const {rows} = await client.query(`SELECT * FROM students`);
                expect(students).toEqual(rows);
            })
        })
        describe('createStudent({cohortId, gitHugUser}), getStudentById(id)', () => {
            it('Creates and returns a new student item, verified by ID', async() => {
                student = await createStudent({cohortId: 1, gitHubUser: 'gitCheck'});
                expect(student).toBeTruthy();
            })
            it('Verifies student created by ID', async() => {
                const verifyStudent = await getStudentById(student.id);
                expect(student).toStrictEqual(verifyStudent);
            })
        })
        describe('getStudentsByCohortId(cohortId)', () => {
            it('Returns an array when looking by cohortId', async() => {
                const studentsByCohortId = await getStudentsByCohortId(1)
                expect(studentsByCohortId).toBeTruthy();
            })
        })
        describe('destroyCohort(id)', () => {
            it('Destroys a user by user ID', async() => {
                await destroyStudentById(student.id);
                const {rows: [destroyedStudent]} = await client.query(`
                    SELECT * FROM projects
                    WHERE id=$1
                `, [student.id])
                expect(destroyedStudent).toBeFalsy();
            })
        })
    })
    describe('Projects', () => {
        let project
        describe('getAllProjects', () => {
            it('Selects and returns all projects', async() => {
                const projects = await getAllProjects();
                const {rows} = await client.query(`SELECT * FROM projects`);
                expect(projects).toEqual(rows);
            })
        })
        describe('createProject({cohortId, startDate, name, isForked}), getProjectById(projectId)', () => {
            it('Creates and returns a new project item', async() => {
                project = await createProject({cohortId: 1, name: 'TEST GROUP', startDate: '01/01/20', isForked: true});
                expect(project).toBeTruthy();
            })
            it('Verifies project created by ID', async() => {
                const verifyProject = await getProjectById(project.id);
                expect(project).toStrictEqual(verifyProject);
            })
        })
        describe('getProjectsByCohortId(cohortId)', () => {
            it('Returns an array when looking by cohortId', async() => {
                const projectsByCohortId = await getProjectsByCohortId(1);
                expect(projectsByCohortId).toBeTruthy()
            })
        })
        describe('destroyProject(projectId)', () => {
            it('Destroys a project by project ID', async() => {
                await destroyProject(project.id);
                const {rows: [destroyedProject]} = await client.query(`
                    SELECT * FROM projects
                    WHERE id=$1
                `, [project.id])
                expect(destroyedProject).toBeFalsy();
            })
        })
    })
})
