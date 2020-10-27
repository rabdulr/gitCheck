/* eslint-disable no-catch-shadow */
/* eslint-disable max-statements */
import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import DatePicker from "react-datepicker";

const Cohort = ({allCohorts, setAllCohorts, cohortClass, updateList, setKey, setCohortClass}) => {

    const [cohortName, setCohortName] = useState('');
    const [studentListArr, setStudentListArr] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const history = useHistory();

    useEffect(() => {
        if (cohortClass) {
            const {projects, students, name} = cohortClass;
            projects.map(project => {
                project.startDate = (new Date(project.startDate)).toLocaleDateString();
                return project
            })
            // Need to redo this whole bit down here
            setStudentListArr(students)
            setCohortName(name);
            setProjectList(projects);
        }
    }, [cohortClass])

    const addProject = async () => {
        const newProject = {
            name: projectName,
            startDate: startDate.toLocaleDateString()
        }
        try {
            if (cohortClass) {
                const {id:cohortId} = cohortClass;
                const {data: project} = await axios.post('/api/projects/createProject', {cohortId, newProject});
                setProjectList([...projectList, project]);
                setProjectName('');
                setStartDate('');
            } else {
                setProjectList([...projectList, newProject]);
                setProjectName('');
                setStartDate('');
            }
        } catch (error) {
            throw error
        }
    };

    const removeProject = async (removedIdx) => {
        try {
            if (cohortClass) {
                await axios.delete(`/api/projects/delete/${projectList[removedIdx].id}`)
            }
            const updateList = projectList.filter((_, idx) => idx !== removedIdx);
            setProjectList(updateList);
        } catch (error) {
            throw error
        }
    };

    const addUsername = async() => {
        try {
            if( cohortClass) {
                const {id:cohortId} = cohortClass;
                const {data: student} = await axios.post('/api/students/createStudent', {cohortId, username});
                setStudentListArr([...studentListArr, student]);
                setUsername('');
            } else {
                setStudentListArr([...studentListArr, username]);
                setUsername('')
            }
        } catch (error) {
            throw error
        }
    }

    const removeUsername = async (removedIdx) => {
        try {
            if (cohortClass) {
                await axios.delete(`/api/students/delete/${studentListArr[removedIdx].id}`)
            }
            const updatedStudentList = studentListArr.filter((_, idx) => idx !== removedIdx);
            setStudentListArr(updatedStudentList)
        } catch (error) {
            throw error
        }
    }

    const createCohort = async (ev) => {
        ev.preventDefault();
        setLoading(true)
        try {
            if (!cohortName) {
                setError('Cohort Name is required');
            } else if (cohortClass) {
                // Run an update on the items
                const {returnedAvgData, cohort} = await updateList(studentListArr, projectList);
                cohortClass.students = studentListArr;
                cohortClass.projects = projectList;
                cohortClass.cohortData = cohort;
                cohortClass.cohortAvg = returnedAvgData
                setAllCohorts(allCohorts.map(cohort => cohort.id === cohortClass.id ? cohortClass : cohort));
                setCohortClass(cohortClass);
                setKey('classData');
                setError('')
            } else {
                // Create DB entries
                const {data: newCohort} = await axios.post('/api/cohorts/createCohort', {cohortName});
                const {id:cohortId} = newCohort;
                const {data: students} = await axios.post('/api/students/createStudents', {cohortId, studentList: studentListArr});
                const {data: projects} = await axios.post('/api/projects/createProjects', {cohortId, projectList: projectList});
                newCohort.students = students;
                newCohort.projects = projects;
                if (students.length > 0 && projects.length > 0) {
                    const {returnedAvgData, cohort} = await updateList(students, projects);
                    newCohort.cohortData = cohort;
                    newCohort.cohortAvg = returnedAvgData;
                }
                setAllCohorts([...allCohorts, newCohort]);
                setCohortName('')
                setStudentListArr([]);
                setProjectList([]);
                setError('');
                history.push(`/cohort/${newCohort.id}`)
                // Need to set route to the page
            }    
        } catch (error) {
            throw error
        } finally {
            setLoading(false)
        }
    };

    return (
            <Row>
                {
                    loading ? <Spinner animation='border' /> :
                    <Card style={{width: '100%'}}>
                        <Card.Body>
                            <Card.Title>
                                <Row>
                                    <Col style={{display: 'flex', alignItems: 'center'}}>
                                        {cohortClass ? 'Update Cohort' : 'Create New Cohort'}
                                    </Col>
                                    <Col style={{display: 'flex', justifyContent: 'flex-end'}}>
                                        {cohortClass ? <Button>Delete</Button> : '' }
                                    </Col>
                                </Row>
                            </Card.Title>
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
                                    <Form.Group as={Row} controlId='formProjectDate' >
                                        <Form.Label column style={{display: 'flex', alignItems: 'center'}}>Project Start Date</Form.Label>
                                        <Col sm="10">
                                            {/* <Form.Control type='text' placeholder='01/01/20' value={startDate} onChange={ev => setStartDate(ev.target.value)} /> */}
                                            <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
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
                                                    <li key={project.name}>
                                                        Project: {project.name}, Start Date: {project.startDate} <Button variant="danger" onClick={() => removeProject(idx)}>-</Button>
                                                    </li>
                                                )}) : <div>No projects currently set</div>
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
                                                    <li key={student.id}>
                                                        {student.gitHubUser || student} <Button variant="danger" onClick={() => removeUsername(idx)}>-</Button>
                                                    </li>
                                                )
                                            })
                                        }
                                        <hr />
                                    </Row>
                                    <Row className='justify-content-end'>
                                        <Button variant="primary" onClick={ev => createCohort(ev)}>{cohortClass ? `Update Cohort` : `Create Cohort`}</Button>{' '}
                                        {
                                            cohortClass ? <Button variant="primary" onClick={() => setKey('classData')}>Cancel</Button> : <Button variant="primary" as={Link} to={'/'}>Cancel</Button>
                                        }
                                    </Row>
                                </Form>
                                {
                                    error
                                }
                            </Card.Body>
                        </Card.Body>
                    </Card> 
                }
            </Row>
    )
}

export default Cohort;
