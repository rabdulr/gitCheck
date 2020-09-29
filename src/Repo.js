import React, {useState, useEffect} from 'react';
import Project from './Project';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import {basicCommitLineData, findData, combineData} from '../functions';

const Repos = ({project, idx, avgData}) => {
    const [data, setData] = useState(basicCommitLineData(project));
    const [classData, setClassData] = useState(findData(avgData, project.name));
    const [combinedData, setCombinedData] = useState(combineData(data, classData))
    const {commit_counts} = project;
    
    useEffect(() => {
        if(project && data.length === 0) {
            setData(basicCommitLineData(project));
        }
    }, [project]);

    useEffect(() => {
        if(project && avgData && !classData) {
            setClassData(findData(avgData, project.name))
        }
    }, [avgData]);
    
    useEffect(() => {
        if(data && classData){
            setCombinedData(combineData(data, classData));
        }
    },[classData, data])

    return (
        <div key={idx}>
            <li><h4>Project Name: {project.name}</h4></li>
            {
                data.length > 0 ? 
                <div>
                    <LineChart width={600} height={300} data={combinedData || data} margin={{top: 5, right: 20, bottom: 5, left: 0}}>
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 'dataMax + 1']}/>
                        <Legend verticalAlign="top" height={10} />
                        <Line type="monotone" dataKey="commits" stroke="#8884d8"/>
                        <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d"/>
                        <Tooltip />
                    </LineChart>
                </div>
                : <h3>No Data to Graph</h3>
            }
            <ul key={project.id}>
                <li>Project URL: {project.url}</li>
                <li>Project Creation Date: {project.created_at}</li>
                <li>Project Updated Date: {project.updated_at}</li>
                <li>Project Pushed Date: {project.pushed_at}</li>
                <li>Project Commit Counts: {project.commit_counts.length}</li>
                {
                    (commit_counts.length > 0) ? 
                        commit_counts.map((commit, idx) => {
                            return ( <div key={commit.sha}><Project commit={commit} /></div>)
                        }) : ''
                }
            </ul>
        </div>
    )
}

export default Repos;