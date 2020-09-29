import React from 'react';
import Repo from './Repo'

const Student = ({student, avgData}) => {
    const {repository, name} = student;
    const {repo} = repository;
    
    return(
        <div>
            <h3>Student: {repository.name}</h3>
            <h3>Username: {repository.login}</h3>
            <h3>Last Repo Update: {repository.updated_at}</h3>
            <h3>Number of public repos: {repository.public_repos}</h3>
            <ul>
                {
                    repo.map((project, idx) => {
                        return (
                            <div key={idx}>
                                <Repo project={project} idx={idx} avgData={avgData}/>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default Student;