import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import Select from 'react-dropdown-select';

import StudentCard from './StudentCard';
import Spinner from 'react-bootstrap/Spinner';
import Student from './Student';
import Nav from 'react-bootstrap/Nav';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import ClassData from './ClassData';
import ClassStudentsView from './ClassStudentsView';
import ClassStudentView from './ClassStudentsView';


const ClassView = ({cohort, avgData }) => {    
    const {cohortData} = cohort;
    const [error, setError] = useState('');

    useEffect(() => {
        if (cohortData.length === 0 || avgData.length === 0) {
            setError('There is no data to go over!')
        }
    }, []);

    return (
        <div>
            {
                error
            }
            <Router>
                <h3>{cohort.name}</h3>
                <Nav variants="tabs" defaultActiveKey="/">
                    <Nav.Item>
                        <Link to={`/classData`} className="nav-link">Class Data</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to={`/studentList`} className="nav-link">Student List</Link>
                    </Nav.Item>
                </Nav>
                <Switch>
                    <Route  path="/classData" render={(props) => <ClassData {...props} avgData={avgData} />} />
                </Switch>
                <Switch>
                    <Route  path="/studentList" render={(props) => <ClassStudentsView {...props} avgData={avgData} cohortData={cohortData} />} />
                </Switch>
            </Router>
        </div>
    )
}

export default ClassView;
