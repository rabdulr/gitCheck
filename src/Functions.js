const basicCommitLineData = (repo, setData) => {
    // Need to return back an array w/ objects
    // Chart is dependent on library
    // React-vis is a bit fiddly

    const commitArr = repo.commit_counts.map(commit => {
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
    
    const newArr = [];

    for(let i = commitArr.length - 1; i >= 0 ; i--) {
        const {date, month, commitDay, utc} = commitArr[i];
        let newDataPoint = {};
        newDataPoint.day = commitDay;
        newDataPoint.commits = 1;

        let nextIdx = i - 1;
        while(commitArr[nextIdx] && date === commitArr[nextIdx].date) { 
            newDataPoint.commits++;
            nextIdx--
        }

        newArr.push(newDataPoint);
        i = nextIdx + 1;
        
        let nextDate = date + 1;

        while( commitArr[nextIdx] && nextDate !== commitArr[nextIdx].date){
            let filler = {};
            filler.day = `${month}/${nextDate}`;
            filler.commits = 0;
            newArr.push(filler);
            nextDate++;
        }
    };

    setData(newArr)
}

module.exports = {
    basicCommitLineData
}