import React, {useState, useEffect, forwardRef} from 'react';
import Project from './Project';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import {basicCommitLineData, findData, combineData} from '../functions';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';
import MaterialTable from 'material-table';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';

const tableIcons = {
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
}

const Repos = ({project, idx, avgData}) => {
    const [data, setData] = useState(basicCommitLineData(project));
    const [classData, setClassData] = useState(findData(avgData, project.name));
    const [combinedData, setCombinedData] = useState(combineData(data, classData));
    const [open, setOpen] = useState(false);
    const {commit_counts} = project;

    useEffect(() => {
        if (project && data.length === 0) {
            setData(basicCommitLineData(project));
        }
    }, [project]);

    useEffect(() => {
        if (project && avgData && !classData) {
            setClassData(findData(avgData, project.name))
        }
    }, [avgData]);

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
                date: new Date(commit.commit.committer.date).toLocaleDateString()
            };
            return basicCommit
        })
    }

    return (
        <div key={idx}>
            <h4>Project: {project.name}</h4>
            {
                data.length > 0 ?
                <>
                    <h6>Last Updated: {new Date(project.updated_at).toLocaleDateString()}</h6>
                    <LineChart width={900} height={300} data={combinedData || data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis allowDecimals={false} domain={[0, 'auto']} />
                        <Legend verticalAlign="top" height={10} />
                        <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d" />
                        <Line type="monotone" dataKey="commits" stroke="#8884d8" strokeWidth="2"  dot={{ strokeWidth: 3 }} />
                        <Tooltip />
                    </LineChart>
                </>
                : <h3>No Data to Graph</h3>
            }
                {/* <li>Project URL: {project.url}</li> */}
                <MaterialTable
                    options={{
                        search: false,
                    }}
                    icons={tableIcons}
                    columns={[
                        { title: "Commit", field: "commit" },
                        { title: "Additions", field: "additions" },
                        { title: "Deletions", field: "deletions" },
                        { title: "Date", field: "date" }
                    ]}

                    title="Commits"

                    data={tableData(commit_counts)}
                />
        </div>
    )
}

export default Repos;
