import React, {useState, useEffect} from 'react';
import axios from 'axios';
import ReactJson from 'react-json-view';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import {projectAvg} from '../functions';


import Student from './Student'


const App = () => {
    const [token, setToken] = useState(window.localStorage.getItem('token'));
    const [userLogin, setUserLogin] = useState(false)
    const [student, setStudent] = useState(JSON.parse(window.localStorage.getItem('student')));
    const [cohort, setCohort] = useState(JSON.parse(window.localStorage.getItem('cohort')));
    const [avgData, setAvgData] = useState([]);
    const [limits, setLimits] = useState({});

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

    useEffect(() => {
        if (token && cohort ) {
            const juiceBoxAvg = projectAvg(cohort, 'juicebox');
            const phenomenaAvg = projectAvg(cohort, 'phenomena')
            setAvgData([...avgData, juiceBoxAvg, phenomenaAvg])
        }
    }, [cohort])
    
    const gitHubLogin = () => {
        window.location.replace('https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&redirect_uri=http://localhost:3000/api/github/callback')
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
            if(user) {
                setStudent(JSON.parse(user));
                console.log('Pulling from storage!');
            } else {
                const {data:{limit, student}} = await axios.get('/api/github/getUser', {params: {token}})
                setStudent(student);
                // localStorage.setItem('student', JSON.stringify(student))
            }
        } catch (error) {
            throw error
        }
    }

    const getStudents = async () => {
        const users = localStorage.getItem('cohort');
        try {
            if (users) {
                setCohort(JSON.parse(users));
                console.log('Pulling from storage!');
            } else {
                const {data:{limit, cohort}} = await axios.get('/api/github/getUsers', {params: {token}})
                console.log('FE COHORT: ', cohort)
                if(!cohort) return;
                setCohort(cohort);
                localStorage.setItem('cohort', JSON.stringify(cohort));
            }
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
            <h1>GitCheck FSA</h1>
            <h3>Access Token: {token ? token : `No Token Set`}</h3>
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
            <h3>Limits</h3>
            <ReactJson src={limits}/>
            <h3>Data</h3>
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
            {
                cohort ?
                    <div>
                        {   
                            cohort.map(student => {
                                return(
                                    <div key={student.name}>
                                        <Student student={student} avgData={avgData}/>
                                    </div>
                                )
                            })
                        }
                    </div>
                    : <h3>No Cohort information</h3>
            }
        </div>
    )
}

export default App