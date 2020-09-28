import React from 'react';

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
                                <li><h3>Project Name: {project.name}</h3></li>
                                <ul>
                                    <li>Project URL: {project.url}</li>
                                    <li>Project Creation Date: {project.created_at}</li>
                                    <li>Project Updated Date: {project.updated_at}</li>
                                    <li>Project Pushed Date: {project.pushed_at}</li>
                                    <li>Project Commit Counts: {project.commit_counts.length}</li>
                                </ul>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default Student;