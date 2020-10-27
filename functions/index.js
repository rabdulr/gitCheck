/* eslint-disable complexity */
// Graphing functions
const days = {
    1: 31,
    2: 28,
    3: 31,
    4: 30,
    5: 31,
    6: 30,
    7: 31,
    8: 31,
    9: 30,
    10: 31,
    11: 30,
    12: 31
};

// Helper function for basicCommitLineData
const createGraphData = (commitData, graphArr) => {
    for (let i = 0; i < commitData.length ; i++) {
        const {date, month, commitDay, utc} = commitData[i];
        let newDataPoint = {};
        newDataPoint.day = commitDay;
        newDataPoint.commits = 1;

        let nextIdx = i + 1;

        while (commitData[nextIdx] && date === commitData[nextIdx].date) {
            newDataPoint.commits++;
            nextIdx++
        }
        graphArr.push(newDataPoint);
        i = nextIdx - 1;

        let nextDate = date - 1;
        let nextMonth = month;

        while ( commitData[nextIdx] && nextDate !== commitData[nextIdx].date){
            if (nextDate <= 0) {
                nextMonth = nextMonth - 1 ? nextMonth - 1 : 12;
                nextDate = days[nextMonth]
            }
            let filler = {};
            filler.day = `${nextMonth}/${nextDate}`;
            filler.commits = 0;
            graphArr.push(filler);
            nextDate--;
            if (nextDate <= 0) {
                nextMonth = month - 1 ? month - 1 : 12;
                nextDate = days[nextMonth]
            }
        }
    }
};

// Helper function for projectAvg()
const calcRepoData = (repoData) => {
    const dictionary = {}
    repoData.map(repo => {
        repo.map(repoInfo => {
            if (!(repoInfo.day in dictionary)) {
                dictionary[repoInfo.day] = {
                    commits: repoInfo.commits,
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

const adjustDateGaps = (data) => {
    const newArr = [];
    for (let i = 0; i < data.length; i++) {
        newArr.push(data[i]);
        const [monthA, dateA] = data[i].day.split('/');
        if (i + 1 < data.length && data[i + 1]) {
            const [monthB, dateB] = data[i + 1].day.split('/');
            let date = (dateA * 1) + 1;
            let month = monthA * 1;

            if (date > days[month]) {
                month = month + 1 > 12 ? 1 : month + 1;
                date = 1
            }
            while (date !== dateB*1) {
                const gapFill = {};
                gapFill.day = `${month}/${date}`;
                gapFill.avgCommits = 0;
                newArr.push(gapFill);
                date++;
                if (date > days[month]) {
                    month = month + 1 > 12 ? 1 : month + 1;
                    date = 1
                }
            }
        }
    }
    return newArr
};

const basicCommitLineData = ({commit_counts}) => {
    if (commit_counts === 0) return;

    const commitArr = commit_counts.map(commit => {
        let newDate = {};
        const utc = new Date(commit.commit.author.date);
        const commitDate = utc.getUTCDate();
        const commitMonth = utc.getUTCMonth() + 1;
        const commitDay = utc.getUTCDay(); // Keeping for due date/day
        const newDateObj = `${commitMonth}/${commitDate}`;
        newDate.date = commitDate;
        newDate.month = commitMonth;
        newDate.commitDay = newDateObj;
        newDate.utc = utc;
        return newDate;
    });
    const graphArr = [];
    commitArr.sort((a, b) => new Date(b.utc) - new Date(a.utc));
    createGraphData(commitArr, graphArr);

    return graphArr;
}

const projectAvg = (cohort, project) => {
    // we know what the project is
    // need to go through each student/repo
    // match up with project
    const repos = [];
    cohort.map(student => {
        const {repository: {repo}} = student
        repo.map(repoInfo => {
            if (repoInfo.name === project.name) repos.push(repoInfo);
        })
    })
    // get Array of all commits for each user
    const repoData = repos.map(basicCommitLineData)
    // Combine information into Obj
    const dataInfo = calcRepoData(repoData);
    const compiledList = Object.keys(dataInfo).map(day => {
        const {commits, users} = dataInfo[day];
        const avgCommits = commits / users;
        return {day, avgCommits}
    })
    compiledList.sort((a, b) => new Date(a.day) - new Date(b.day));
    const avgData = adjustDateGaps(compiledList);
    return { project, avgData, name: project.name }
}

// Match data with repo
const findData = (dataList, projectName) => {
    const matchProj = dataList.filter(data => {
        return data.project.name === projectName
    });
    if (!matchProj.length) return null;
    const {avgData} = matchProj[0];
    return avgData
}

// Combine data types
const combineData = (userData, avgData) => {

    if (!userData || !avgData) return;

    const dictionary = {};

    avgData.map(avg => {
        dictionary[avg.day] = {
            avgCommits: avg.avgCommits
        };
    });

    userData.map(user => {
        if (!(user.day in dictionary)) {
            dictionary[user.day] = {
                commits: user.commits
            }
        } else {
            dictionary[user.day].commits = user.commits;
        }

    });


    const combinedArray = Object.keys(dictionary).map(key => {
        const {commits, avgCommits} = dictionary[key]
        return {day: key, commits, avgCommits}
    });

    return combinedArray;

};

// This will probably be removed if items are forked
const splitHairs = (word, name) => {
    let dictionary = {};
    if (word === name) return true;
    const splitWord = word.split('')
    splitWord.forEach(letter => {
      if (!(letter in dictionary)){
        dictionary[letter] = 1
      } else {
        dictionary[letter]++;
      }
    });

    name.toLowerCase().split('').forEach(letter => {
      if (dictionary[letter] > 0) {
        dictionary[letter]--
      }

      if (!dictionary[letter]) {
        delete dictionary[letter]
      }
    });
    return Object.keys(dictionary).length === 0
}

//currently not necessary - may be used for personal projects
// const checkRepoName = (name) => {
//     const projects = [' UNIV_Phenomena_Starter']
//     const isTrue = projects.map(project => {
//         return splitHairs(project, name)
//     })
//     return isTrue.includes(true);
// };

const timedPromise = (time, payload) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(payload)
        }, time)
    })
};

const chunkStudentList = (list, size) => {
    const result = [];
    for (let i = 0; i < list.length; i += size) {
        let chunk = list.slice(i, i + size)
        result.push(chunk)
    }
    return result;
}

const forkInsert = (repo) => {
    const commit = {
        name: 'fork',
        author: {
            name: 'Fork',
            date: repo.created_at
        }
    }
    return { commit }
}

// Artifact of compare function
// const compare = (a, b) => {
//     const dateA = new Date(a.day);
//     const dateB = new Date(b.day);

//     let comparison = 0;

//     if(dateA < dateB) {
//         comparison = 1;
//     } else if (dateA > dateB) {
//         comparison = -1;
//     }

//     return comparison * -1
// }
module.exports = {
    basicCommitLineData,
    projectAvg,
    findData,
    combineData,
    splitHairs,
    timedPromise,
    chunkStudentList,
    forkInsert
}