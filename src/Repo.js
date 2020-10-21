import React, {useState, useEffect} from 'react';
import Project from './Project';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import {basicCommitLineData, findData, combineData} from '../functions';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import ListGroup from 'react-bootstrap/ListGroup';

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
    }, [classData, data])

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
            <ul key={project.id}>
                <li>Project URL: {project.url}</li>
                <ListGroupItem onClick={() => setOpen(!open)}>Project Commit Counts: {project.commit_counts.length - 1}</ListGroupItem>
                <Collapse in={open}>
                    <ul>
                    {
                        commit_counts.map((commit, idx) => {
                            if (!commit.files) return;
                            return (
                                <div key={commit.sha}>
                                    <Project commit={commit} />
                                </div>)
                            })
                    }
                    </ul>
                </Collapse>
            </ul>
        </div>
    )
}

export default Repos;
