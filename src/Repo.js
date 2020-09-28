import React from 'react';
import Project from './Project'

const Repos = ({project, idx}) => {
    const {commit_counts} = project;
    return (
        <div key={idx}>
            <li><h3>Project Name: {project.name}</h3></li>
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