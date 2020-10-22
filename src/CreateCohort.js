import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-dropdown-select';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

const CreateCohort = ({allCohorts, setAllCohorts, cohortClass, updateList, setKey, setCohortClass}) => {

    const [cohortName, setCohortName] = useState('');
    const [studentListArr, setStudentListArr] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [dueDate, setDueDate] = useState('');

    useEffect(() => {
        if (cohortClass) {
            const name = cohortClass.cohort
            const {value: {projects, students}} = cohortClass;
            const newList = students.map(student => {
                return {value: student, label: student}
            });
            setStudentListArr(newList)
            setCohortName(name);
            setProjectList(projects);
        }
    }, [])

    const addProject = () => {
        const newProject = {
            name: projectName,
            date: dueDate
        }
        setProjectList([...projectList, newProject]);
        setProjectName('');
        setDueDate('');
    };

    const removeProject = (removedIdx) => {
        const updateList = projectList.filter((_, idx) => idx !== removedIdx);
        setProjectList(updateList);
    }

    const createCohort = async (ev) => {
        ev.preventDefault();
        const students = studentListArr.map(student => student.value);
        const value = {
            students,
            projects: projectList,
            cohortData: [],
            cohortAvg: []
        };
        const newCohort = {
            cohort: cohortName,
            value
        };
        if (cohortClass) {
            // Need to send update of list/items that were updated to DB
            // Run an update on the items
            const {returnedAvgData, cohort} = await updateList(students, projectList);
            newCohort.id = cohortClass.id
            newCohort.value.cohortData = cohort;
            newCohort.value.cohortAvg = returnedAvgData;
            console.log('new Cohort: ', newCohort)
            setAllCohorts(allCohorts.map(cohort => cohort.id === newCohort.id ? newCohort : cohort));
            setCohortClass(newCohort)
            setKey('classData');
        } else {
            // Create DB entries
            setAllCohorts([...allCohorts, newCohort]);
            setCohortName('')
            setStudentListArr([]);
            setProjectList([]);
        }
    };

    return (
            <Row>
                <Card style={{width: '100%'}}>
                    <Card.Body>
                        <Card.Title>{cohortClass ? 'Update Cohort' : 'Create New Cohort'}</Card.Title>
                        <Card.Body>
                            <Form>
                                <Form.Group as={Row} controlId='formCohorttName'>
                                    <Form.Label column>Cohort name</Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="text" placeholder="Cohort Name" value={cohortName} onChange={ev => setCohortName(ev.target.value)} />
                                    </Col>
                                </Form.Group>
                                <hr />
                                <Form.Group as={Row} controlId='formProject'>
                                    <Form.Label column>Project name</Form.Label>
                                    <Col sm="10">
                                        <Form.Control type="text" placeholder="Project Name" value={projectName} onChange={ev => setProjectName(ev.target.value)} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} controlId='formProjectDate'>
                                    <Form.Label column>Project due date</Form.Label>
                                    <Col sm="10">
                                        <Form.Control type='text' placeholder='01/01/20' value={dueDate} onChange={ev => setDueDate(ev.target.value)} />
                                    </Col>
                                </Form.Group>
                                <Row style={{display: 'flex', justifyContent: 'flex-end'}}>
                                    <Button variant="primary" onClick={addProject}>Add Project</Button>
                                </Row>
                                <Row>
                                    <Col>
                                        {
                                        projectList.length > 0 ?
                                            projectList.map((project, idx) => {
                                                return (
                                                <li key={project.name + project.date}>
                                                    Project: {project.name}, Start Date: {project.date} <Button variant="danger" onClick={() => removeProject(idx)}>-</Button>
                                                </li>
                                            )}) : <div>No projects set</div>
                                        }
                                    </Col>
                                </Row>
                                <hr />
                                <Form.Group as={Row} controlId='formStudenList'>
                                    <Form.Label column>Student List</Form.Label>
                                    <Col sm="10">
                                    <Select
                                        multi
                                        create
                                        options={studentListArr}
                                        onCreateNew={item => setStudentListArr([...studentListArr, item])}
                                        values={studentListArr}
                                        backspaceDelete={true}
                                        onChange={values => setStudentListArr(values)}
                                        placeholder="Add GitHub Usernames"
                                        style={{width: '100%'}} />
                                    </Col>
                                </Form.Group>
                                <Button variant="primary" onClick={ev => createCohort(ev)}>{cohortClass ? `Update Cohort` : `Create Cohort`}</Button>{' '}
                                {
                                    cohortClass ? <Button variant="primary" onClick={() => setKey('classData')}>Cancel</Button> : <Button variant="primary" as={Link} to={'/'}>Cancel</Button>
                                }
                            </Form>
                        </Card.Body>
                    </Card.Body>
                </Card>
            </Row>
    )
}

export default CreateCohort;
