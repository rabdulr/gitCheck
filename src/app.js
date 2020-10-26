import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import {
    BrowserRouter as Router,
    Route,
    Link,
    Switch,
    useParams
  } from 'react-router-dom';

import CreateCohort from './CreateCohort';
import ClassInfo from './ClassInfo';


const App = () => {
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [userLogin, setUserLogin] = useState(false)
    const [student, setStudent] = useState(JSON.parse(window.localStorage.getItem('student')));
    // const [cohort, setCohort] = useState(JSON.parse(window.localStorage.getItem('cohort')));
    const [limits, setLimits] = useState({});


    const [allCohorts, setAllCohorts] = useState([]);
    

    useEffect(() => {
        // attempting to clear accesss_token from URL
        // Come back later once functions work
        // const query = window.location.search.substring(1);

        // if (!userLogin && query) {

        //     const token = query.split('access_token=')[1];
        //     const tokenStorage = localStorage.getItem('token');

        //     if (tokenStorage) {
        //         setToken(tokenStorage);
        //     }

        //     if (token) {
        //         setToken(token);
        //         localStorage.setItem('token', token);
        //     }

        //     setUserLogin(true);
        // }
        // getStudents();
        getUser();
    }, [])

    const gitHubLogin = () => {
        // window.location.replace('https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&scope=repo,user&redirect_uri=http://localhost:3000/api/github/callback');
        window.location.replace('/api/github/login')
    };

    const getUser = async() => {
        const {data: {user}} = await axios.get('/api/users');
        setToken(user.accessToken)
        return user
    }

    const logOut = () => {
        setToken('');
        localStorage.clear();
        setUserLogin(false)
        window.location = '/'
    }

    const getStudent = async () => {
        const user = localStorage.getItem('student');
        try {
                const {data: {student}} = await axios.get('/api/github/getUser', {params: {token}})
                setStudent(student);
                // localStorage.setItem('student', JSON.stringify(student))
        } catch (error) {
            throw error
        }
    }

    const getStudents = async () => {
        // const users = localStorage.getItem('cohort');
        try {
            const {data: {returnedAvgData, cohort}} = await axios.get('/api/github/getUsers', {params: {token}})
            console.log('FE COHORT: ', cohort)
            if (!cohort) return;
            const studentNames = cohort.map(student => student.name)
            const cohortObj = [{
                id: 1,
                cohort: '2006',
                value: {
                    students: studentNames,
                    projects: [{name: 'UNIV_Phenomena_Starter', date: '9/28/20'}, {name: 'UNIV_FitnessTrackr_Starter', date: '10/5/20'}],
                    cohortData: cohort,
                    cohortAvg: returnedAvgData
                }
            }];
            setAllCohorts(cohortObj)
            // setCohort(cohort);
            // setAvgData(returnedAvgData)
        } catch (error) {
            throw error;
        }
    };

    const updateList = async (usersList, projectList) => {
        try {
            const {data: {returnedAvgData, cohort}} = await axios.post('/api/github/updateList', {usersList, projectList}, {params: {token}});
            console.log('avg data sets: ', returnedAvgData, cohort)
            return {returnedAvgData, cohort}
        } catch (error) {
            throw error
        }
    }

    const getLimit = async () => {
        try {
            const {data: limit} = await axios.get('/api/github/getLimit', {params: {token}})
            setLimits(limit);
        } catch (error) {
            throw error;
        }
    };

    console.log('all cohorts: ', allCohorts)
    return (
        <>
            <Container fluid>
                <Navbar bg="light" expand="md">
                    <Navbar.Brand as={Link} to={'/'}>gitCheck FSA</Navbar.Brand>
                    {
                        token ?
                            <>
                                <DropdownButton id="dropdown-basic-button" title="Select Cohort" variant="secondary">
                                    {
                                        allCohorts.length > 0 ?
                                            allCohorts.map(newClass => <Dropdown.Item as={Link} to={`/cohort/${newClass.id}`}>{newClass.cohort}</Dropdown.Item>)
                                            : <></>
                                    }
                                    {/* <Dropdown.Item href="#/cohort">Cohort</Dropdown.Item> */}
                                </DropdownButton>
                                <Navbar.Collapse className="justify-content-end">
                                    <Button variant="primary" as={Link} to={'/new-cohort'} >Add New</Button>{' '}
                                    <Button variant="primary" onClick={logOut}>Log Out</Button>
                                </Navbar.Collapse>
                                {/* <Button variant="primary" onClick={getStudent}>Get User</Button> */}
                                {/* <Button variant="primary" onClick={getStudents}>Get Students</Button> */}
                                {/* <Button variant="primary" onClick={getLimit}>Get Limits</Button> */}
                            </> :
                            <>
                                <Navbar.Collapse className="justify-content-end">
                                    <Button variant="primary" onClick={gitHubLogin}>GitHub Login</Button>
                                </Navbar.Collapse>
                            </>
                    }
                </Navbar>
                <Row>
                    <Col>
                        {
                            token ?
                                <>
                                        <Route exact path="/">
                                            <h3>Welcome!!</h3>
                                        </Route>
                                        <Route path="/cohort/:id">
                                            <ClassInfo updateList={updateList} allCohorts={allCohorts} setAllCohorts={setAllCohorts} />
                                        </Route>
                                        <Route path="/new-cohort">
                                            <CreateCohort allCohorts={allCohorts} setAllCohorts={setAllCohorts} updateList={updateList} />
                                        </Route>
                                </> : <></>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default App
