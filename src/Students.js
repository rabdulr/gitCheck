import React, {useState} from 'react';
import Repo from './Repo';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Collapse from 'react-bootstrap/Collapse'

const Student = ({student, avgData}) => {
    const [open, setOpen] = useState(false);

    const {repository, name} = student;
    const {repo} = repository;
    repository.updated_at = new Date(repository.updated_at)

    return (
        <div>
            <Card>
                <Card.Body>
                    <Card.Title>{repository.name || repository.login}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{repository.login}</Card.Subtitle>
                    <ListGroup className="list-group-flush">
                        {/* <Collapse in={open}> */}
                        {
                            repo.map((project, idx) => {
                                return (
                                    <div key={Math.random() + idx}>
                                        <Repo project={project} idx={idx} avgData={avgData} />
                                    </div>
                                )
                            })
                        }
                        {/* </Collapse> */}
                    </ListGroup>
                </Card.Body>
            </Card>
            {/* <h3>Student: {repository.name}</h3>
            <h4>Username: {repository.login}</h4>
            <h4>Last Repo Update: {repository.updated_at}</h4>
            <h4>Number of public repos: {repository.public_repos}</h4> */}
        </div>
    )
};

export default Student;
