import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Nav from 'react-bootstrap/Nav';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';


import Student from './Student';
import StudentCard from './StudentCard'


const App = () => {
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [userLogin, setUserLogin] = useState(false)
    const [student, setStudent] = useState(JSON.parse(window.localStorage.getItem('student')));
    const [cohort, setCohort] = useState(JSON.parse(window.localStorage.getItem('cohort')));
    const [avgData, setAvgData] = useState([]);
    const [limits, setLimits] = useState({});
    const [studentInfo, setStudentInfo] = useState();

    useEffect(() =>{
        // attempting to clear accesss_token from URL
        // Come back later once functions work
        const query = window.location.search.substring(1);

        if(!userLogin && query) {
            
            const token = query.split('access_token=')[1];
            const tokenStorage = localStorage.getItem('token');
    
            if(tokenStorage) {
                setToken(tokenStorage);
            };
    
            if(token) {
                setToken(token);
                localStorage.setItem('token', token);
            };

            setUserLogin(true);
        }  
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
            if(!cohort) return;
            setCohort(cohort);
            setAvgData(returnedAvgData)
        } catch (error) {
            throw error;
        }
    };

    const getLimit = async () => {
        try {
            const {data:limit} = await axios.get('/api/github/getLimit', {params: {token}})
            setLimits(limit);
        } catch (error) {
            throw error;
        }
    }

    return(
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
                <Row>
                    <Col>
                        <h3>Limits</h3>
                        <Row>
                            <ReactJson src={limits}/>
                        </Row>
                    </Col>
                </Row>

            </Container>
            <Container fluid>
                <Row>
                    <Col>
                        <h3>Data</h3>
                    </Col>
                    </Row>
                    <Row className="justify-content-center">
                            {
                                avgData.length > 0 ? 
                                <div>
                                    <LineChart width={900} height={300} data={avgData[0].avgData} margin={{top: 5, right: 0, bottom: 5, left: 0}}>
                                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                        <XAxis dataKey="day" />
                                        <YAxis domain={[0, 'auto']}/>
                                        <Legend verticalAlign="top" height={10} />
                                        <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d"/>
                                        <Tooltip />
                                    </LineChart>
                                </div>
                                : <h3>No Data</h3>
                            }
                    </Row>
            </Container>
            <Container fluid>
                <Row noGutters={true}>
                    <Col xs={2}>
                        {
                            cohort ?
                                <div>
                                    {   
                                        cohort.map(student => {
                                            return(
                                                <ListGroupItem action onClick={() => setStudentInfo(student)}>
                                                    <div key={student.name}>
                                                        <StudentCard student={student} avgData={avgData} />
                                                    </div>
                                                </ListGroupItem>
                                            )
                                        })
                                    }
                                </div>
                                : <h4>No Cohort information</h4>
                        }
            
                    </Col>
                    <Col>
                        {
                            studentInfo ?
                                <Student student={studentInfo} avgData={avgData}/>
                                : <h4>No info</h4>
                        }
                    </Col>
                </Row>
            </Container>

            {/* {
                cohort ?
                    <div>
                        {   
                            cohort.map(student => {
                                return(
                                    <ListGroupItem>
                                    <div key={student.name}>
                                        <Student student={student} avgData={avgData}/>
                                    </div>
                                    </ListGroupItem>
                                )
                            })
                        }
                    </div>
                    : <h3>No Cohort information</h3>
            } */}
        </div>
    )
}

export default App