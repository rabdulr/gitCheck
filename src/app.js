import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import Card from 'react-bootstrap/Card';
import Select from 'react-dropdown-select';
import Spinner from 'react-bootstrap/Spinner';


import Student from './Student';
import StudentCard from './StudentCard';
import Cohort from './Cohort';
import ClassView from './ClassView'


const App = () => {
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [userLogin, setUserLogin] = useState(false)
    const [student, setStudent] = useState(JSON.parse(window.localStorage.getItem('student')));
    const [cohort, setCohort] = useState(JSON.parse(window.localStorage.getItem('cohort')));
    const [avgData, setAvgData] = useState([]);
    const [limits, setLimits] = useState({});

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
                cohort: '2006',
                value: {
                    students: studentNames,
                    projects: [{name: 'UNIV_Phenomena_Starter', date: '9/28/20'}, {name: 'UNIV_FitnessTrackr_Starter', date: '10/5/20'}],
                    cohortData: cohort
                }
            }];
            setAllCohorts(cohortObj)
            setCohort(cohort);
            setAvgData(returnedAvgData)
        } catch (error) {
            throw error;
        }
    };

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
                <Row>
                    <Col>
                        <h1>GitCheck FSA</h1>
                    </Col>
                        <Nav>
                            {
                                token ?
                                    <div>
                                        <button onClick={logOut}>Log Out</button>
                                        <button onClick={getStudent}>Get User</button>
                                        <button onClick={getStudents}>Get Students</button>
                                        <button onClick={getLimit}>Get Limits</button>
                                    </div> :
                                    <div>
                                        <button onClick={gitHubLogin}>GitHub Login</button>
                                    </div>
                            }
                        </Nav>
                </Row>
                <Row>
                    <Col>
                        <h3>Access Token: {token ? token : `No Token Set`}</h3>
                    </Col>
                </Row>
            </Container>
            <Container fluid>
                    {/* <Row>
                        {
                            allCohorts ?
                                <Cohort cohort={allCohorts} />
                                : <h3>No Data</h3>
                        }
                    </Row> */}
            </Container>
            <Container fluid>
                <Select options={allCohorts} onChange={(values) => setCohortClass(values[0].value)} labelField={'cohort'} valueField={'value'}/>
                {
                    cohortClass ? <ClassView cohort={cohortClass} avgData={avgData} /> : <div></div>
                }
            </Container>
        </div>
    )
}

export default App
