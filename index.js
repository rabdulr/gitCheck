let token;
require('dotenv').config();
const COHORT = ['Jonmorgan12', 'tillyninjaspace']
const PORT = 3000;
const express = require('express');
const server = express();
const axios = require('axios');

const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const bodyParser = require('body-parser');
server.use(bodyParser.json());

// server.use((req, res, next) => {
//     console.log("<---- Body Logger START ---->");
//     console.log(req.body);
//     console.log("<---- Body Logger END ---->");
//     next();
// });


const getLimit = async (token) => {
    const headers = {headers: { 'Authorization': `token ${token}`}};
    const { data:limit } = await axios('https://api.github.com/rate_limit', headers);
    // const limit = await limitResponse.json();
    return limit;
}

const getUserInfo = async (token, username) => {
    const headers = {headers: { 'Authorization': `token ${token}`}};
    try {
        const URL = `https://api.github.com/users/${username}`;
    
        const {data:user} = await axios(`${URL}`, headers);
        const {data:repos} = await axios(`${URL}/repos`, headers);

        await Promise.all(repos.map(async(repo) => {
            try {
                if(repo.name !== 'juicebox') {
                    return;
                }    
                delete repo.owner;
                
                const COMMIT_URL = `https://api.github.com/repos/${username}/${repo.name}`;
                
                const {data:commits} = await axios(`${COMMIT_URL}`, headers);
                // const commits = await commitResponse.json();
                
                delete commits.author;
                delete commits.owner;
                
                let commitList = [];
                
                const {data:commitMaster} = await axios(`${COMMIT_URL}/commits/master`, headers);
                // const commitMaster = await commitMasterResponse.json();
                delete commitMaster.author;
                delete commitMaster.owner;
                
                // commitList.push(commitMaster.parents);
                
                if(commitMaster.parents.length > 0) {
                    // Recursive function
                    await Promise.all(
                        commitMaster.parents.map(async (sha) => {
                                await createCommitList(token, sha, commitList)
                        })
                    )
                }
                repo.commit_counts = await commitList;
                // console.log("commit counts: ", commits.commit_counts);
                // console.log('commits', commits)
                // repo.commitInfo = commits;
                return repo;
                } catch (error) {
                throw error;
                }
            }))
        user.repo = repos
        // info[username].repo = repos;
        return user;
    } catch (error) {
        throw error;
    }
    
};

const createCommitList = async (token, commitItem, arr) => {
    const headers = {headers: { 'Authorization': `token ${token}`}};
    try {
        if(commitItem.url) {
            const {data:newCommit} = await axios(`${commitItem.url}`, headers);
            // const newCommit = await newCommitResponse.json();
            delete newCommit.author;
            delete newCommit.owner;
            arr.push(newCommit)
            console.log('arr: ', arr)
            if(newCommit.parents && newCommit.parents.length > 0) {
                await Promise.all(
                    newCommit.parents.map(async (sha) => {
                        await createCommitList(token, sha, arr)
                    })
                )
            } else {
                return
            }
        } else {
            return;
        }
    } catch (error) {
        throw error;
    }
};

// getUserInfo(user);

server.use(express.static(__dirname));

server.get('/gitCheck', async (req, res) => {
    try {
        const {data:newUser} = getUserInfo(user);
        const limit = await getLimit();
        res.send({limit, newUser})
    } catch (error) {
        throw error;
    }
})


server.get('/callback', async (req, res, next) => {
    const requestToken = req.query.code
    console.log('request Token: ', requestToken);
    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then(async (response)=>{
        const accessToken = response.data.access_token
        token = accessToken;
        console.log('token ', token);
        const jon = await getUserInfo(token, 'Jonmorgan12');
        const cohort = await Promise.all(COHORT.map(async(student) => {
            const info = {};
            info.name = student;
            info.repository = await getUserInfo(token, student);
            return info
        }))
        const limit = await getLimit(token);
        res.send({limit, cohort, jon})
    })
})

server.listen(PORT, () => {
    console.log(`Listening on poart ${PORT}`)
})