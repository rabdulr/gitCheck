const router = require('express').Router();
const {STUDENT_LIST, CLIENT_ID, CLIENT_SECRET, PROJECTS} = process.env;
const COHORT = JSON.parse(STUDENT_LIST);
const {timedPromise, projectAvg, chunkStudentList} = require('../functions')
const axios = require('axios');
const redis = require('redis');
const sizeof = require('object-sizeof')
const REDIST_PORT = 6379;
const redisCLient = redis.createClient();

// Project List for testing
const projects = JSON.parse(PROJECTS)

// Cohort information is currently hard coded
// Will need to create a way to get from an array on Front End

// Functions

const headers = (token) => {
    const header = {
        headers: {
            'Authorization': `token ${token}`
        }
    };
    return header;
};

const startGetUser = async (token, student) => {
    console.log(`STARTING PROCESS: ${student}`)
    const info = {};
    info.name = student;
    info.repository = await getUserInfo(token, student);
    console.log(`ENDING PROCESS: ${student}`)
    redisCLient.setex(info.name, 18000, JSON.stringify(info));
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

const getUserInfo = async (token, username) => {
    try {
        console.log(`GETTING info for ${username}`)
        const URL = `https://api.github.com/users/${username}`;
        const PRIVATE_URL = `https://api.github.com/repos/${username}`

        const {data: user} = await axios(`${URL}`, headers);
        const repos = await Promise.all(projects.map(async project => {
            // return project;
            const {data} = await axios(`${PRIVATE_URL}/${project.name}`, headers(token));
            data.projectStart = new Date(project.date)
            return data
        }));
        await Promise.all(repos.map(async (repo) => {
            // create a function in which we look at the name and cross check a list of repos of repos we are looking for
            // If repo is not part of list, create a new key .ignore = true, return
            // Repos are forks, therefore, no need to veriy - functionality will work until personal projects appear
            // console.log('Repo name (lower case): ', repo.name.toLowerCase())
            // repo.ignore = !checkRepoName(repo.name.toLowerCase());
            // console.log('Repo ignore: ', repo.ignore)
            // if(repo.ignore) return repo;
            repo.ignore = false;

            delete repo.owner;

            const forkInsert = {}
            const commit = {
                name: 'fork',
                author: {
                    name: 'Fork',
                    date: repo.created_at
                }
            };

            forkInsert.commit = commit;

            const commitList = [];
            console.log(`STARTING REPO ${repo.name} for ${username}`)
            const response = await axios(`${repo.url}/commits/master`, headers(token)).catch(err => err.response.status);
            if (response === 409) {
                repo.commit_counts = commitList;
                return repo;
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
            commitList.push(forkInsert);
            repo.commit_counts = await commitList;
            // acc.push(repo);
            console.log(`ENDING REPO ${repo.name} for ${username}`)
            return repo
        }));

        // run function to filter out repos with .ignore
        user.repo = repos.filter(repo => repo.ignore === false);
        // store repos information into redis for call back later
        redisCLient.setex(`${username}.repo`, 18000, JSON.stringify(user.repo));
        console.log(`FINISHED getting info for ${username}`)
        return user;
    } catch (error) {
        throw error;
    }

};

// Server Calls
router.get('/callback', async (req, res, next) => {
    try {
        const requestToken = req.query.code
        const {data: {access_token}} = await axios({
            method: 'post',
            url: `https://github.com/login/oauth/access_token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${requestToken}`,
            headers: {
                accept: 'application/json'
            }
        });
        res.redirect(`/?access_token=${access_token}`)
    } catch (error) {
        throw error;
    }
})

router.get('/getLimit', async (req, res, next) => {
    const {token} = req.query
    try {
        const limit = await getLimit(token);
        res.send({limit})
    } catch (error) {
        throw error;
    }
});

// router.get('/getUser', async (req, res) => {
//     const {token} = req.query;
//     // Call limit later as own function
//     // const limit = await getLimit(token);
//     const student = {}
//     // Have name be whater the body is for future
//     student.name = 'tillyninjaspace';
//     student.repository = await getUserInfo(token, '');
//     res.send({student})
// });


router.get('/getUsers', async (req, res) => {
    const {token} = req.query;
    // Function below with mapping
    try {
        console.log(COHORT)
        const chunkList = chunkStudentList(COHORT, 2);
        let delayTime = 0;
        const chunkedData = await Promise.all(chunkList.map( set => {
            return Promise.all(set.map(async (username) => {
                delayTime += 50
                const {data: {student}} = await timedPromise(delayTime, axios.get(`http://localhost:3000/api/github/getUsers/${username}`, {params: {token}}))
                return student;
            }))
            .catch(err => console.log(err));
        }));
        const cohort = chunkedData.flat().filter(item => item !== undefined);
        // Calculate AVG Data for each project
        const returnedAvgData = projects.map(project => projectAvg(cohort, project));
        // const cohort = sorted.map(student => {
        //     delete student.repository.repo;
        //     return student
        // });
        console.log('avg Data: ', returnedAvgData);
        console.log('Size of cohort file: ', sizeof(cohort))
        res.send({cohort, returnedAvgData})
    } catch (error) {
        throw error;
    }
});

router.get('/getUsers/:username', cache, async (req, res) => {
    const {username} = req.params;
    const {token} = req.query;
    try {
        const student = await startGetUser(token, username);
        res.send({student})
    } catch (error) {
        throw error
    }
});

// Breaking down repo calls
router.get('/getUsers/:username/repo', (req, res) => {
    const {username} = req.params;
    try {
        redisCLient.get(`${username}.repo`, (error, cachedData) => {
            if (error) throw error;
            if (cachedData !== null) {
                console.log(`PULLING REDIS REPO for ${username}`);
                const repo = JSON.parse(cachedData);
                res.send({repo})
            }
        })
    } catch (error) {
        throw error
    }
})
// Redis

function cache(req, res, next) {
    const {username} = req.params
    console.log('REDIS CONSOLE: ', username)
    redisCLient.get(username, (error, cachedData) => {
        if (error) throw error;
        if (cachedData !== null) {
            console.log(`PULLING REDIS for ${username}`)
            const student = JSON.parse(cachedData)
            res.send({student})
        } else {
            next()
        }
    })
}

module.exports = {
    router
}