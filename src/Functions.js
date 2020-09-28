const basicLineData = (repo, setData) => {
    // Need to return back an array w/ objects
    // Chart is dependent on library
    // React-vis is a bit fiddly
    let dateObj = {};

    repo.commit_counts.map(commit => {
        const utc = new Date(commit.commit.author.date);
        const commitDate = utc.getUTCDate();
        const commitMonth = utc.getUTCMonth();
        const newDateObj = `${commitMonth}/${commitDate}`
        if(newDateObj in dateObj) {
            // dateObj[newDateObj]++;
            dateObj.utc
        } else {
            dateObj[newDateObj] = 1;
        }
    });
    const keys = Object.keys(dateObj);

    const updateObj = {...dateObj};

    for(let i = 0; i < keys.length - 1; i++) {
        // const date = keys[i].getUTCDate();
        console.log('Utc Date: ', keys[i])
    }
    const dataArray = Object.keys(dateObj).map(date => {
        return {x: date, y: dateObj[date]}
    })
    
    console.log('data Array: ', dataArray)
    setData(dataArray)
}

module.exports = {
    basicLineData
}