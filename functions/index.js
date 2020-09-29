// Graphing functions

const basicCommitLineData = ({commit_counts}) => {
    // Need to return back an array w/ objects
    // Chart is dependent on library
    // React-vis is a bit fiddly
    
    if(commit_counts === 0) return;

    const commitArr = commit_counts.map(commit => {
        let newDate = {};
        const utc = new Date(commit.commit.author.date);
        const commitDate = utc.getUTCDate();
        const commitMonth = utc.getUTCMonth();
        const newDateObj = `${commitMonth}/${commitDate}`;
        newDate.date = commitDate;
        newDate.month = commitMonth;
        newDate.commitDay = newDateObj;
        newDate.utc = utc;
        return newDate;
    });
    
    const graphArr = [];

    createGraphData(commitArr, graphArr);

    return graphArr;
}

// Helper function for basicCommitLineData
const createGraphData = (commitData, graphArr) => {
    for(let i = commitData.length - 1; i >= 0 ; i--) {
        const {date, month, commitDay, utc} = commitData[i];
        let newDataPoint = {};
        newDataPoint.day = commitDay;
        newDataPoint.commits = 1;

        let nextIdx = i - 1;
        while(commitData[nextIdx] && date === commitData[nextIdx].date) { 
            newDataPoint.commits++;
            nextIdx--
        }

        graphArr.push(newDataPoint);
        i = nextIdx + 1;
        
        let nextDate = date + 1;

        while( commitData[nextIdx] && nextDate !== commitData[nextIdx].date){
            let filler = {};
            filler.day = `${month}/${nextDate}`;
            filler.commits = 0;
            graphArr.push(filler);
            nextDate++;
        }
    };
};

const projectAvg = (cohort, project) => {
    // we know what the project is
    // need to go through each student/repo
    // match up with project
    const repos = []
    cohort.map(student => {
        const {repository:{repo}} = student
        repo.map(repoInfo => {
            if(repoInfo.name.toLowerCase().includes(project)) repos.push(repoInfo);
        })
    })
    
    // get Array of all commits for each user
    const repoData = repos.map(basicCommitLineData)
    // Combine information into Obj
    const dataInfo = calcRepoData(repoData);
    const avgData = Object.keys(dataInfo).map(day => {
        const {commits, users} = dataInfo[day];
        const avgCommits = commits / users;
        return {day, avgCommits}
    })
    return { project, avgData }
    console.log('data info: ', avgData)
}

// Helper function for projectAvg()
const calcRepoData = (repoData) => {
    const dictionary = {}
    repoData.map(repo => {
        repo.map(repoInfo => {
            if(!(repoInfo.day in dictionary)) {
                dictionary[repoInfo.day] = {
                    commits:repoInfo.commits,
                    users: 1,
                };
            } else {
                dictionary[repoInfo.day].commits += repoInfo.commits;
                dictionary[repoInfo.day].users++
            }

        })
    })
    return dictionary
};

// Match data with repo
const findData = (dataList, projectName) => {
    const matchProj = dataList.filter(data => projectName.toLowerCase().includes(data.project));
    if(!matchProj.length) return null;
    const {avgData} = matchProj[0];
    return avgData
}

// Combine data types
const combineData = (userData, avgData) => {
    
    if(!userData || !avgData) return;

    const dictionary = {};

    userData.map(user => {
        dictionary[user.day] = {
            commits: user.commits
        };
    });

    avgData.map(avg => {
        if(!(avg.day in dictionary)) {
            dictionary[avg.day] = {
                avgCommits: avg.avgCommits
            }
        } else {
            dictionary[avg.day].avgCommits = avg.avgCommits;
        }
    });

    const combinedArray = Object.keys(dictionary).map(key => {
        const {commits, avgCommits} = dictionary[key]
        return {day: key, commits, avgCommits}
    });

    return combinedArray;

};

module.exports = {
    basicCommitLineData,
    projectAvg,
    findData,
    combineData
}