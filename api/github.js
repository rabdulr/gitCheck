const router = require('express').Router();
const COHORT = ['Jonmorgan12', 'tillyninjaspace', 'frankjoesilva', 'albert4770', , 'Ajrelerford', 'Zezlita'];
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const axios = require('axios');

// Functions
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
                // map is not skipping/returning from the function 

                // console.log('repo name: ', repo.name.toLowerCase());
                // if(!repo.name.toLowerCase().includes('juicebox')) {
                //     console.log('is juicebox?: ', repo.name.toLowerCase().includes('juicebox'));
                //     return;
                // }    

                delete repo.owner;
                
                const COMMIT_URL = `https://api.github.com/repos/${username}/${repo.name}`;
                
                // const {data:commits} = await axios(`${COMMIT_URL}`, headers);
                // const commits = await commitResponse.json();
                
                // delete commits.author;
                // delete commits.owner;
                // console.log('commits: ', commits)
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
            arr.push(newCommit);
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

// Server Calls
router.get('/callback', async (req, res, next) => {
    try {
        const requestToken = req.query.code
        const {data:{access_token}} = await axios({
            method: 'post',
            url: `https://github.com/login/oauth/access_token?client_id=${clientId}&client_secret=${clientSecret}&code=${requestToken}`,
            headers: {
                accept: 'application/json'
            }
        });
        res.redirect(`/?access_token=${access_token}`)
                // .then(async (response)=>{
                //     const accessToken = response.data.access_token
                //     token = accessToken;
                //     console.log('token ', token);
                //     const student = await getUserInfo(token, 'tillyninjaspace');
                //     // const cohort = await Promise.all(COHORT.map(async(student) => {
                //     //     const info = {};
                //     //     info.name = student;
                //     //     info.repository = await getUserInfo(token, student);
                //     //     return info
                //     // }))
                //     const limit = await getLimit(token);
                //     res.send({limit, student})
                // })
    } catch (error) {
        throw error;
    }
})

// router.get('/', (req, res) => {
//     res.redirect('https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&redirect_uri=http://localhost:3000/callback');
// });

router.get('/getUser', async (req, res) => {
    console.log('req user: ', req.query);
    const {token} = req.query;
    const limit = await getLimit(token);
    const student = await getUserInfo(token, 'tillyninjaspace');
    // const cohort = await Promise.all(COHORT.map(async(student) => {
    //     const info = {};
    //     info.name = student;
    //     info.repository = await getUserInfo(token, student);
    //     return info
    // }))
    res.send({limit, student})
})

module.exports = {
    router
}