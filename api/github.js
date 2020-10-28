/* eslint-disable max-statements */
const gitHub = require('express').Router();
const {timedPromise, projectAvg, chunkStudentList, forkInsert} = require('../functions')
const axios = require('axios');
const redis = require('redis');
const bluebird = require('bluebird');

bluebird.promisifyAll(redis);

const redisCLient = redis.createClient();
const {isLoggedIn} = require('./utils');

// Functions

const headers = (token) => {
    const header = {
        headers: {
            Authorization: `token ${token}`
        }
    };
    return header;
};

const startGetUser = async (token, student, projects) => {
    console.log(`STARTING PROCESS: ${student}`)
    const info = {};
    info.name = student;
    info.repository = await getUserInfo(token, student, projects);
    console.log(`ENDING PROCESS: ${student}`)
    // redisCLient.setex(info.name, 18000, JSON.stringify(info));
    return info
};

const createCommitList = async (token, commitItem, username, arr, projectStart) => {
    try {
        if (commitItem.url) {
            const {data: newCommit} = await axios(`${commitItem.url}`, headers(token));
            if (new Date(newCommit.commit.author.date) < new Date(projectStart)) return;
            if (newCommit.author.login === username) {
                arr.push(newCommit);
            }
            delete newCommit.author;
            delete newCommit.owner;
            // potentially loop through to delete patch files as they can be large
            if (newCommit.parents && newCommit.parents.length > 0) {
                await Promise.all(
                    newCommit.parents.map(async (sha) => {
                        await createCommitList(token, sha, username, arr, projectStart);
                    })
                ).catch(err => console.log(err))
            }
        } else {
            return;
        }
    } catch (error) {
        throw error;
    }
};

const returnUserData = (chunkList, projectList, token) => {
    try {
        let delayTime = 0;
        return Promise.all(chunkList.map(set => {
            return Promise.all(set.map(async (studentData) => {
                delayTime += 20
                const {data: {student}} = await timedPromise(delayTime, axios.post(`http://localhost:3000/api/github/getUsers/${studentData.gitHubUser}`, {projectList}, {params: {token}}))
                return student;
            }))
        }))
    } catch (error) {
        return error
    }
}

const getUserInfo = async (token, username, projects) => {
    try {
        console.log(`GETTING info for ${username}`)
        const URL = `https://api.github.com/users/${username}`;
        const PRIVATE_URL = `https://api.github.com/repos/${username}`
        console.log('token: ', token)

        const {data: user} = await axios(`${URL}`, headers(token));
        const repos = await Promise.all(projects.map(async project => {
            // return project;
            try {
                const {data} = await axios(`${PRIVATE_URL}/${project.name}`, headers(token));
                data.projectStart = new Date(project.startDate)
                return data
            } catch (error) {
                throw error
            }

        }));
        await Promise.all(repos.map(async (repo) => {
            // Since repo is currently forked, we are getting exact matches
            try {
                const repoReturn = await redisCLient.getAsync(`${username}.${repo.name}`);
                const redisCommit = JSON.parse(repoReturn);          
                delete repo.owner;
                if (redisCommit) {
                    repo.commit_counts = redisCommit;
                    console.log(`PULLING REDIS: ${username}/${repo.name} `)
                    return repo
                }
                const commitList = [];
                console.log(`STARTING REPO ${repo.name} for ${username}`)
                let response = await axios(`${repo.url}/commits/master`, headers(token)).catch(err => err.response.status);
                
                if (response === 409) {
                    repo.commit_counts = commitList;
                    redisCLient.setex(`${username}.${repo.name}`, 18000, JSON.stringify(commitList));
                    return repo;
                } else if (response === 422) {
                    response = await axios(`${repo.url}/commits/main`, headers(token)).catch(err => err.response.status)
                }

                const {data: commitMaster} = response;
                delete commitMaster.author;
                delete commitMaster.owner;
    
                commitList.push(commitMaster);
    
                if (commitMaster.parents.length > 0) {
                    // Recursive function
                    await Promise.all(
                        commitMaster.parents.map(async (sha) => {
                                await createCommitList(token, sha, username, commitList, repo.projectStart)
                        })
                    ).catch(err => console.log(err))
                }
                commitList.push(forkInsert(repo));
                repo.commit_counts = commitList;
                redisCLient.setex(`${username}.${repo.name}`, 18000, JSON.stringify(commitList));
                console.log(`ENDING REPO ${repo.name} for ${username}`)
                return repo
            } catch (error) {
                throw error
            }
        }));
        user.repo = repos
        console.log(`FINISHED getting info for ${username}`)
        return user;
    } catch (error) {
        throw error;
    }

};

gitHub.post('/updateList', isLoggedIn, async (req, res) => {
    const {accessToken} = req.user;
    const {usersList, projectList} = req.body;
    try {
        const chunkList = chunkStudentList(usersList, 2);
        const chunkedData = await returnUserData(chunkList, projectList, accessToken);
        const cohort = chunkedData.flat().filter(item => item !== undefined);
        // Calculate AVG Data for each project
        const returnedAvgData = projectList.map(project => projectAvg(cohort, project));
        res.send({cohort, returnedAvgData})
    } catch (error) {
        throw error;
    }
});

gitHub.post('/getUsers', isLoggedIn, async (req, res) => {
    const {accessToken} = req.user
    const {students, projects} = req.body
    // Function is reading seed data from .env
    try {
        const chunkList = chunkStudentList(students, 2);
        const chunkedData = await returnUserData(chunkList, projects, accessToken);
        const cohort = chunkedData.flat().filter(item => item !== undefined);
        // Calculate AVG Data for each project
        const returnedAvgData = projects.map(project => projectAvg(cohort, project));
        res.send({cohort, returnedAvgData})
    } catch (error) {
        throw error;
    }
});

gitHub.post('/getUsers/:username', async (req, res) => {
    const {username} = req.params;
    const {token} = req.query;
    const {projectList} = req.body
    try {
        const student = await startGetUser(token, username, projectList);
        res.send({student})
    } catch (error) {
        throw error
    }
});

module.exports = gitHub
