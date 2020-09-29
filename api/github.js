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
        const URL = `https://api.github.com/users/${username}`;
    
        const {data:user} = await axios(`${URL}`, headers);
        const {data:repos} = await axios(`${URL}/repos`, headers(token));

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
                
                let commitList = [];
                
                const {data:commitMaster} = await axios(`${COMMIT_URL}/commits/master`, headers(token));
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
    try {
        if(commitItem.url) {
            const {data:newCommit} = await axios(`${commitItem.url}`, headers(token));
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

router.get('/getUsers', async (req, res) => {
    const{token} = req.query;
    // Function below with mapping
    const cohort = await Promise.all(COHORT.map(async(student) => {
        const info = {};
        info.name = student;
        info.repository = await getUserInfo(token, student);
        return info
    }));
    res.send({cohort})
})

module.exports = {
    router
}