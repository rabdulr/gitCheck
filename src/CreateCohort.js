import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-dropdown-select';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CreateCohort = ({allCohorts, setAllCohorts, cohortClass, updateList, setKey, setCohortClass}) => {

    const [cohortName, setCohortName] = useState('');
    const [studentListArr, setStudentListArr] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [username, setUsername] = useState('');
    const [studentsToDestroy, setStudentsToDestroy] = useState([]);
    const [projectsToDestroy, setProjectsToDestroy] = useState([]);

    useEffect(() => {
        if (cohortClass) {
            const {projects, students, name} = cohortClass;
            console.log('name: ', name)
            // Need to redo this whole bit down here
            setStudentListArr(students)
            setCohortName(name);
            setProjectList(projects);
        }
    }, [])

    const addProject = () => {
        const newProject = {
            name: projectName,
            startDate: dueDate
        }
        setProjectList([...projectList, newProject]);
        setProjectName('');
        setDueDate('');
    };

    const removeProject = (removedIdx) => {
        if (cohortClass) {
            setProjectsToDestroy([...projectsToDestroy, projectList[removedIdx]])
        }
        const updateList = projectList.filter((_, idx) => idx !== removedIdx);
        setProjectList(updateList);
    };

    const addUsername = () => {
        setStudentListArr([...studentListArr, username]);
        setUsername('')
    }
    
    const removeUsername = (removedIdx) => {
        if (cohortClass) {
            setStudentsToDestroy([...studentsToDestroy, studentListArr[removedIdx]])
        }
        const updatedStudentList = studentListArr.filter((_, idx) => idx !== removedIdx);
        setStudentListArr(updatedStudentList)
    }

    const createCohort = async (ev) => {
        ev.preventDefault();
        if (cohortClass) {
            // Need to send update of list/items that were updated to DB
            // Run an update on the items
            console.log('students to destroy: ', studentsToDestroy);
            console.log('projects to destroy: ', projectsToDestroy)
            const studentsRes = await axios.delete('/api/students/deleteBatch', {data: {students: studentsToDestroy}});
            const projectsRes = await axios.delete('/api/projects/deleteBatch', {data: {projects: projectsToDestroy}});
            console.log('response from delete: ', studentsRes, projectsRes)

            // const {returnedAvgData, cohort} = await updateList(students, projectList);
            // newCohort.id = cohortClass.id
            // newCohort.value.cohortData = cohort;
            // newCohort.value.cohortAvg = returnedAvgData;
            // console.log('new Cohort: ', newCohort)
            // setAllCohorts(allCohorts.map(cohort => cohort.id === newCohort.id ? newCohort : cohort));
            // setCohortClass(newCohort)
            // setKey('classData');
        } else {
            // Create DB entries
            console.log('studentList: ', studentListArr)
            const {data: newCohort} = await axios.post('/api/cohorts/createCohort', {cohortName});
            const {data: students} = await axios.post('/api/students/createStudents', {newCohort, studentListArr});
            const {data: projects} = await axios.post('/api/projects/createProjects', {newCohort, projectList});
            console.log('projects: ', projects)
            newCohort.students = students;
            newCohort.projects = projects;
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
                                                    Project: {project.name}, Start Date: {project.startDate} <Button variant="danger" onClick={() => removeProject(idx)}>-</Button>
                                                </li>
                                            )}) : <div>No projects set</div>
                                        }
                                    </Col>
                                </Row>
                                <hr />
                                <Form.Group as={Row} controlId='formStudenList'>
                                    <Form.Label column>Add Student</Form.Label>
                                    <Col sm="10">
                                        <Form.Control type='text' placeholder='Github username' value={username} onChange={ev => setUsername(ev.target.value)} 
                                            onKeyPress={ev => {
                                                if (ev.key === 'Enter') addUsername();
                                        }} />
                                    </Col>
                                </Form.Group>
                                <Row>
                                    {
                                        studentListArr.map((student, idx) => {
                                            return(
                                                <li key={idx}>
                                                    {student.gitHubUser || student} <Button variant="danger" onClick={() => removeUsername(idx)}>-</Button>
                                                </li>
                                            )
                                        })
                                    }
                                    <hr />
                                </Row>
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
