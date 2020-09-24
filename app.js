console.log('Hello!');

const user = 'bboysamuel';
let info = {};

const getLimit = async () => {
    const limitResponse = await fetch('https://api.github.com/rate_limit');
    const limit = await limitResponse.json();
    console.log(limit);
    return limit;
}

const getUserInfo = async (username) => {

    const URL = `https://api.github.com/users/${username}`;

    const userResponse = await fetch(`${URL}`);
    const repoResponse = await fetch(`${URL}/repos`);
    const user = await userResponse.json();
    const repos = await repoResponse.json();

    // repos.forEach(repo => {
    //     findRepos(repo, username);
    // });

    repos.forEach(async(repo) => {
        const COMMIT_URL = `https://api.github.com/repos/${username}/${repo.name}`;

        const commitResponse = await fetch(`${COMMIT_URL}`);
        const commits = await commitResponse.json();

        delete commits.author;
        delete commits.owner;

        const commitList = [];

        const commitMasterResponse = await fetch(`${COMMIT_URL}/commits/master`);
        const commitMaster = await commitMasterResponse.json();
        delete commitMaster.author;
        delete commitMaster.owner;
        
        commitList.push(commitMaster);

        if(commitMaster.parents.length > 0) {
            // Recursive function
            createCommitList(commitMaster, commitList);
        }

        commits.commit_counts = commitList;

        repo.commit_info = commits;
    });

    info[username] = user;
    info[username].repo = repos;
};

const createCommitList = async (commit, commitList) => {
    if(commit && commit.parents.length > 0) {
        const newCommitResponse = await fetch(`${commit.parents[0].url}`);
        const newCommit = await newCommitResponse.json();
        delete newCommit.author;
        delete newCommit.owner;
        commitList.push(newCommit);
        const nextCommit = await createCommitList(newCommit, commitList);
        return nextCommit;
    } else {
        return;
    }
}
// const findRepos = async (repo, username) => {
//     const COMMIT_URL = `https://api.github.com/repos/${username}/${repo.name}`;

//     const commitResponse = await fetch(`${COMMIT_URL}`);
//     const commits = await commitResponse.json();

//     delete commits.author;
//     delete commits.owner;

//     const commitList = [];

//     const commitMasterResponse = await fetch(`${COMMIT_URL}/commits/master`);
//     const commitMaster = await commitMasterResponse.json();
//     delete commitMaster.author;
//     delete commitMaster.owner;
    
//     commitList.push(commitMaster);

//     commits.commit_counts = commitMaster;

//     repo.commit_info = commits;
// }

// getUserInfo(user);
getLimit();
