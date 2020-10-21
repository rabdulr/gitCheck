import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Select from 'react-dropdown-select';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Navbar from 'react-bootstrap/Navbar';

import CreateCohort from './CreateCohort';
import ClassData from './ClassData';
import ClassStudentView from './ClassStudentsView';


const App = () => {
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [userLogin, setUserLogin] = useState(false)
    const [student, setStudent] = useState(JSON.parse(window.localStorage.getItem('student')));
    // const [cohort, setCohort] = useState(JSON.parse(window.localStorage.getItem('cohort')));
    const [limits, setLimits] = useState({});
    const [key, setKey] = useState('classData');

    const [allCohorts, setAllCohorts] = useState();
    const [cohortClass, setCohortClass] = useState();

    useEffect(() =>{
        // attempting to clear accesss_token from URL
        // Come back later once functions work
        const query = window.location.search.substring(1);

        if (!userLogin && query) {

            const token = query.split('access_token=')[1];
            const tokenStorage = localStorage.getItem('token');

            if (tokenStorage) {
                setToken(tokenStorage);
            }

            if (token) {
                setToken(token);
                localStorage.setItem('token', token);
            }

            setUserLogin(true);
        }
        getStudents();
    }, [])

    const gitHubLogin = () => {
        window.location.replace('https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&scope=repo,user&redirect_uri=http://localhost:3000/api/github/callback')
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
                const {data:{student}} = await axios.get('/api/github/getUser', {params: {token}})
                setStudent(student);
                // localStorage.setItem('student', JSON.stringify(student))
        } catch (error) {
            throw error
        }
    }

    const getStudents = async () => {
        // const users = localStorage.getItem('cohort');
        try {
            const {data:{returnedAvgData, cohort}} = await axios.get('/api/github/getUsers', {params: {token}})
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
    }

    return (
        <div>
            <Container fluid>
                    <Navbar bg="light" expand="md">
                        <Navbar.Brand href="#home">gitCheck FSA</Navbar.Brand>
                        {
                            token ?
                                <>
                                    <Select options={allCohorts} onChange={(values) => setCohortClass(values[0])} labelField={'cohort'} valueField={'value'}/>
                                    <Navbar.Collapse className="justify-content-end">
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
                {/* <Row>
                    <Col >
                        {
                            !token ? <><h3>Welcome, you're not logged in yet!</h3></> 
                                : <><h3>You're totally logged in</h3></>
                        }
                    </Col>
                    <Col >
                        <h3>Here's some stuff that should show up.</h3>
                    </Col>
                </Row> */}
                <Row>
                    <Col>
                        {
                            cohortClass ? 
                                <Tabs defaultActiveKey="classData" id="data-navigation" activeKey={key} onSelect={k => setKey(k)}>
                                    <Tab eventKey="classData" title="Class Data">
                                        <ClassData avgData={cohortClass.value.cohortAvg} />
                                    </Tab>
                                    <Tab eventKey="classStudentView" title="Student List">
                                        <ClassStudentView avgData={cohortClass.value.cohortAvg} cohortData={cohortClass.value.cohortData} />
                                    </Tab>
                                    <Tab eventKey="classEdit" title="Edit Class">
                                        <CreateCohort allCohorts={allCohorts} setAllCohorts={setAllCohorts} cohortClass={cohortClass} setKey={setKey} updateList={updateList} setCohortClass={setCohortClass} />
                                    </Tab>
                                </Tabs>
                                : <div>No Data Set</div>
                        }
                    </Col>
                </Row>
            </Container>
            {/* <Container fluid>
                <Col>
                    <Select options={allCohorts} onChange={(values) => setCohortClass(values[0])} labelField={'cohort'} valueField={'value'}/>
                </Col>
                {
                    cohortClass ? <ClassView cohort={cohortClass} allCohorts={allCohorts} setAllCohorts={setAllCohorts} />
                    : <div></div>
                }
            </Container> */}
        </div>
    )
}

export default App
