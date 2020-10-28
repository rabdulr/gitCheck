import React, {useState, useEffect} from 'react';
import Repo from './Repo';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';

const Student = ({student, avgData, projectSearch}) => {
    const [studentRepo, setStudentRepo] = useState([])
    const {repository, name} = student;
    
    useEffect(() => {
        repository.updated_at = new Date(repository.updated_at)
        if (!projectSearch ) {
            setStudentRepo(student.repository.repo)
        } else {
            const filteredProjects = student.repository.repo.filter(repo => repo.name.toLowerCase().includes(projectSearch.toLowerCase()));
            setStudentRepo(filteredProjects);
        }
    }, [student]);
    
    useEffect(() => {
        if (!projectSearch ) {
            setStudentRepo(student.repository.repo)
        } else {
            const filteredProjects = studentRepo.filter(repo => repo.name.toLowerCase().includes(projectSearch.toLowerCase()));
            setStudentRepo(filteredProjects);
        }
    }, [projectSearch]);

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>{repository.name || repository.login}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{repository.login}</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                        {
                            studentRepo.map((project, idx) => {
                                return (
                                    <div key={idx}>
                                        <Repo project={project} idx={idx} avgData={avgData} />
                                    </div>
                                )
                            })
                        }
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    )
};

export default Student;
