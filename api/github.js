const router = require('express').Router();
const {STUDENT_LIST, CLIENT_ID, CLIENT_SECRET} = process.env;
const COHORT = JSON.parse(STUDENT_LIST)
const axios = require('axios');

// Cohort information is currently hard coded
// Will need to create a way to get from an array on Front End

// Functions

const headers = (token) => {
    const header = {
        headers: {
            'Authorization' : `token ${token}`
        }
    };
    return header;
};

const getLimit = async (token) => {
    const { data:limit } = await axios('https://api.github.com/rate_limit', headers(token));
    return limit;
};


const getUserInfo = async (token, username) => {
    try {
        console.log(`GETTING info for ${username}`)
        const URL = `https://api.github.com/users/${username}`;
        
        const {data:user} = await axios(`${URL}`, headers);
        const {data:repos} = await axios(`${URL}/repos`, headers(token));
        await Promise.all(repos.map(async (repo) => {
            // acc = [];
            
            delete repo.owner;
            
            // const COMMIT_URL = `https://api.github.com/repos/${username}/${repo.name}`;
            
            const commitList = [];
            console.log(`STARTING REPO ${repo.name} for ${username}`)
            const response = await axios(`${repo.url}/commits/master`, headers(token)).catch(err => err.response.status);
            if(response === 409) {
                repo.commit_counts = commitList;
                return repo;
            };
            const {data:commitMaster} = response;
            // const commitMaster = await commitMasterResponse.json();
            delete commitMaster.author;
            delete commitMaster.owner;
            
            // commitList.push(commitMaster.parents);
            
            if(commitMaster.parents.length > 0) {
                // Recursive function
                await Promise.all(
                    commitMaster.parents.map(async (sha) => {
                            await createCommitList(token, sha, commitList)
                    }).catch(err => console.log(err))
                )
            }
            repo.commit_counts = await commitList;
            // acc.push(repo);
            console.log(`ENDING REPO ${repo.name} for ${username}`)
            return repo
        }));
        user.repo = repos;
        // info[username].repo = repos;
        console.log(`FINISHED getting info for ${username}`)
        return user;
    } catch (error) {
        throw error;
    }
    
};

const createCommitList = async (token, commitItem, arr) => {
    try {
        if(commitItem.url) {
            const {data:newCommit} = await axios(`${commitItem.url}`, headers(token));
            // const newCommit = await newCommitResponse.json();
            delete newCommit.author;
            delete newCommit.owner;
            // potentially loop through to delete patch files as they can be large
            arr.push(newCommit);
            if(newCommit.parents && newCommit.parents.length > 0) {
                await Promise.all(
                    newCommit.parents.map(async (sha) => {
                        await createCommitList(token, sha, arr);
                    }).catch(err => console.log(err))
                )
            }
        } else {
            return;
        }
    } catch (error) {
        throw error;
    }
};

// Server Calls
router.get('/callback', async (req, res, next) => {
    try {
        const requestToken = req.query.code
        const {data:{access_token}} = await axios({
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

router.get('/getUser', async (req, res) => {
    const {token} = req.query;
    // Call limit later as own function
    // const limit = await getLimit(token);
    const student = {}
    // Have name be whater the body is for future
    student.name = 'tillyninjaspace';
    student.repository = await getUserInfo(token, 'tillyninjaspace'); 
    res.send({student})
});

const timedPromise = (time, payload) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(payload)
        }, time)
    })
}
router.get('/getUsers', async (req, res) => {
    const{token} = req.query;
    // Function below with mapping
    try {
        console.log(COHORT)
        const chunkList = chunkStudentList(COHORT, 2);
        let delayTime = 0;
        const chunkedData = await Promise.all(chunkList.map(async (set) => {
            return await Promise.all(set.map(async(student) => {
                    delayTime += 1000
                    return await timedPromise(delayTime, startGetUser(token, student));
                }))
                .catch(err => console.log(err));
        }));
        const cohort = chunkedData.flat().filter(item => item !== undefined);
        // const cohort = await Promise.all(COHORT.map(async(student) => {
        //     return await startGetUser(token, student);
        // }))
        // .catch(err => console.log(err));
        console.log({cohort})
        res.send({cohort})
    } catch (error) {
        throw error;
    }
});

const chunkStudentList = (list, size) => {
    const result = [];
    for (let i = 0; i < list.length; i += size) {
        let chunk = list.slice(i, i + size)
        result.push(chunk)
    }
    return result;
}

const startGetUser = async (token, student) => {
    console.log(`STARTING PROCESS: ${student}`)
    const info = {};
    info.name = student;
    info.repository = await getUserInfo(token, student);
    console.log(`ENDING PROCESS: ${student}`)
    return info
};

module.exports = {
    router
}