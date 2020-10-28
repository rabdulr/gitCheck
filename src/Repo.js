import React, {useState, useEffect, forwardRef} from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer} from 'recharts';
import {basicCommitLineData, findData, combineData} from '../functions';
import MaterialTable from 'material-table';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import ArrowDownward from '@material-ui/icons/ArrowDownward';


const tableIcons = {
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
}

const Repos = ({project, idx, avgData}) => {
    const [data, setData] = useState([]);
    const [classData, setClassData] = useState([]);
    const [combinedData, setCombinedData] = useState([]);
    const {commit_counts} = project;

    useEffect(() => {
            setData(basicCommitLineData(project));
            setClassData(findData(avgData, project.name))
    }, [project]);

    useEffect(() => {
        if (data && classData){
            setCombinedData(combineData(data, classData));
        }
    }, [classData, data]);


    const tableData = (commits) => {
        const filteredCommits = commits.filter(commit => commit.commit.author.name !== "Fork");

        return filteredCommits.map(commit => {
            const basicCommit = {
                commit: commit.commit.message,
                additions: commit.stats.additions,
                deletions: commit.stats.deletions,
                url: commit.html_url,
                date: new Date(commit.commit.committer.date).toLocaleDateString()
            };
            return basicCommit
        })
    }

    console.log('commit_counts: ', commit_counts)

    return (
        <>
            <h4 key={project.name}>Project: {project.name}</h4>
            {
                data.length > 0 ?
                <>
                    <h6>Last Updated: {new Date(project.updated_at).toLocaleDateString()}</h6>
                    <ResponsiveContainer width="90%" height={300}>
                        <LineChart data={combinedData || data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                            <XAxis dataKey="day" />
                            <YAxis allowDecimals={false} domain={[0, 'auto']} />
                            <Legend verticalAlign="top" height={10} />
                            <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d" />
                            <Line type="monotone" dataKey="commits" stroke="#8884d8" strokeWidth="2"  dot={{ strokeWidth: 3 }} />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </>
                : <h3>Data Unavailble to Graph</h3>
            }
                <MaterialTable
                    options={{
                        search: false,
                        filtering: false,
                    }}
                    icons={tableIcons}
                    columns={[
                        { title: "Commit", field: "commit", render: rowData => <a href={rowData.url} target='_blank'>{rowData.commit}</a> },
                        { title: "Additions", field: "additions" },
                        { title: "Deletions", field: "deletions" },
                        { title: "Date", field: "date" },
                    ]}

                    title="Commits"

                    data={tableData(commit_counts)}

                />
        </>
    )
}

export default Repos;
