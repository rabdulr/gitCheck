import React from 'react';
import Repo from './Repo'

const Student = ({student}) => {
    const {repo} = student;
    
    return(
        <div>
            <h1>Student Card</h1>
            <h3>Student: {student.name}</h3>
            <h3>Username: {student.login}</h3>
            <h3>Last Repo Update: {student.updated_at}</h3>
            <h3>Number of public repos: {student.public_repos}</h3>
            <ul>
                {
                    repo.map((project, idx) => {
                        return (
                            <div key={idx}>
                                <Repo project={project} idx={idx} />
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
};

export default Student;