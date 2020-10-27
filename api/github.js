/* eslint-disable max-statements */
const gitHub = require('express').Router();
const {STUDENT_LIST, CLIENT_ID, CLIENT_SECRET, PROJECTS} = process.env;
const COHORT = JSON.parse(STUDENT_LIST);
const {timedPromise, projectAvg, chunkStudentList, forkInsert} = require('../functions')
const axios = require('axios');
const sizeof = require('object-sizeof')
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

const getLimit = async (token) => {
    const { data: limit } = await axios('https://api.github.com/rate_limit', headers(token));
    return limit;
};

const returnUserData = (chunkList, projectList, token) => {
    try {
        let delayTime = 0;
        return Promise.all(chunkList.map(set => {
            return Promise.all(set.map(async (studentData) => {
                delayTime += 50
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
                }

                if (response === 422) {
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

gitHub.get('/getLimit', async (req, res, next) => {
    const {token} = req.query
    try {
        const limit = await getLimit(token);
        res.send({limit})
    } catch (error) {
        throw error;
    }
});

gitHub.post('/updateList', isLoggedIn, async (req, res) => {
    const {accessToken} = req.user;
    const {usersList, projectList} = req.body;
    try {
        const chunkList = chunkStudentList(usersList, 2);
        const chunkedData = await returnUserData(chunkList, projectList, accessToken);
        const cohort = chunkedData.flat().filter(item => item !== undefined);
        // Calculate AVG Data for each project
        const returnedAvgData = projectList.map(project => projectAvg(cohort, project));
        console.log('Size of cohort file: ', sizeof(cohort))
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
        console.log('Size of cohort file: ', sizeof(cohort))
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

// Breaking down repo calls
// gitHub.get('/getUsers/:username/repo', (req, res) => {
//     const {username} = req.params;
//     try {
//         redisCLient.get(`${username}.repo`, (error, cachedData) => {
//             if (error) throw error;
//             if (cachedData !== null) {
//                 console.log(`PULLING REDIS REPO for ${username}`);
//                 const repo = JSON.parse(cachedData);
//                 res.send({repo})
//             }
//         })
//     } catch (error) {
//         throw error
//     }
// })
// Redis

// function cache(req, res, next) {
//     const {username} = req.params
//     console.log('REDIS CONSOLE: ', username)
//     redisCLient.get(username, (error, cachedData) => {
//         if (error) throw error;
//         if (cachedData !== null) {
//             console.log(`PULLING REDIS for ${username}`)
//             const student = JSON.parse(cachedData)
//             res.send({student})
//         } else {
//             next()
//         }
//     })
// }

module.exports = gitHub
