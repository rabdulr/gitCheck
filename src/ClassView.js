import React, {useState, useEffect} from 'react';
import Nav from 'react-bootstrap/Nav';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from 'react-router-dom';
import ClassData from './ClassData';
import ClassStudentsView from './ClassStudentsView';
import CreateCohort from './CreateCohort';


const ClassView = ({cohort, allCohorts, setAllCohorts }) => {
    const {value: {cohortData, cohortAvg}} = cohort
    const [error, setError] = useState('');

    useEffect(() => {
        if (cohortData.length === 0 || cohortAvg.length === 0) {
            setError('There is no data to go over!')
        }
    }, []);

    return (
        <div>
            {
                error
            }
            <Router>
                <Nav variant="tabs" defaultActiveKey="/classData">
                    <Nav.Item>
                        <Nav.Link as={Link} to="/classData">Class Data</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/studentList">Student List</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link as={Link} to="/editCohort">Edit Cohort</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Switch>
                    <Route  path="/classData" render={(props) => <ClassData {...props} avgData={cohortAvg} />} />
                </Switch>
                <Switch>
                    <Route  path="/studentList" render={(props) => <ClassStudentsView {...props} avgData={cohortAvg} cohortData={cohortData} />} />
                </Switch>
                <Switch>
                    <Route  path="/editCohort" render={(props) => <CreateCohort {...props} allCohorts={allCohorts} setAllCohorts={setAllCohorts} cohortClass={cohort} />} />
                </Switch>
            </Router>
        </div>
    )
}

export default ClassView;
