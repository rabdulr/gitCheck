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
    
    const name = cohort.cohort;
    const {value:{cohortData, cohortAvg}} = cohort
    const [error, setError] = useState('');

    useEffect(() => {
        if (cohortData.length === 0 || cohortAvg.length === 0) {
            setError('There is no data to go over!')
        }
    }, []);

    return (
        <>
            {
                error
            }
            <Router>
                <Nav variants="tabs" defaultActiveKey="/classData">
                    <Nav.Item>
                        <Link to={`/classData`} className="nav-link">Class Data</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to={`/studentList`} className="nav-link">Student List</Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Link to={`/editCohort`} className="nav-link">Edit Cohort</Link>
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
        </>
    )
}

export default ClassView;
