import React, {useState, useEffect} from 'react';
import Repo from './Repo';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

const Student = ({student, avgData}) => {
    const [studentRepo, setStudentRepo] = useState([])
    const {repository, name} = student;
    repository.updated_at = new Date(repository.updated_at)

    useEffect(() => {
        setStudentRepo(student.repository.repo)
    }, [student]);
    
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
                                    <div key={Math.random() + idx}>
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
