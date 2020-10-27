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
    Route,
    Link
  } from 'react-router-dom';

import CreateCohort from './Cohort';
import ClassInfo from './ClassInfo';
import Main from './Main';
import { Nav } from 'react-bootstrap';


const App = () => {
    const [token, setToken] = useState('');
    const [limits, setLimits] = useState({});
    const [allCohorts, setAllCohorts] = useState([]);
    const [userLoginName, setUserLoginName] = useState('');
    
    const getUser = async() => {
        const {data: {user}} = await axios.get('/api/users');
        setUserLoginName(user.username)
        setToken(user.accessToken)
    }

    const getAllCohorts = async() => {
        const {data: cohortsReturn} = await axios.get('/api/cohorts/getAllCohorts');
        setAllCohorts(cohortsReturn)
    }

    useEffect(() => {
        if (!token) {
            getUser();
            getAllCohorts();
        }
    }, [])

    const gitHubLogin = () => {
        window.location.replace('/auth/github/login')
    };

    const logOut = () => {
        window.location.replace('/auth/github/logout')
    }

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

    return (
        <>
            <Container fluid>
                <Navbar bg="light" expand="md">
                    <Navbar.Brand as={Link} to={'/'}>gitCheck FSA</Navbar.Brand>
                    {
                        token ?
                            <>
                                <DropdownButton id="dropdown-basic-button" title={!allCohorts ? 'Loading...' : 'Select Cohort'} variant="secondary" disabled={!allCohorts}>
                                    {
                                        allCohorts.length > 0 ?
                                            allCohorts.map(newClass => <Dropdown.Item as={Link} to={`/cohort/${newClass.id}`} key={newClass.name}>{newClass.name}</Dropdown.Item>)
                                            : <Dropdown.Item as={Link} to={`/new-cohort`}>Create A Cohort</Dropdown.Item>
                                    }
                                </DropdownButton>
                                <Navbar.Collapse className="justify-content-end">
                                    <Button variant="secondary" as={Link} to={'/new-cohort'} >Add New Cohort</Button>{' '}
                                    <Button variant="secondary" onClick={logOut}>Log Out</Button>
                                </Navbar.Collapse>
                            </> :
                            <>
                                <Navbar.Collapse className="justify-content-end">
                                    <Button variant="light" onClick={gitHubLogin}>GitHub Login</Button>
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
                                            <Main username={userLoginName} />
                                        </Route>
                                        <Route path="/cohort/:id">
                                            <ClassInfo updateList={updateList} allCohorts={allCohorts} setAllCohorts={setAllCohorts} />
                                        </Route>
                                        <Route path="/new-cohort">
                                            <CreateCohort allCohorts={allCohorts} setAllCohorts={setAllCohorts} updateList={updateList} />
                                        </Route>
                                </> : <Main />
                        }
                    </Col>
                </Row>
                <Navbar bg='light' expand='md'>
                    <Navbar.Collapse className="justify-content-center">
                        <Nav.Link href="https://www.github.com/rabdulr/gitCheck">GitHub Source</Nav.Link>
                        <Nav.Link href="mailto:rabdulr@icloud.com">Feedback</Nav.Link>
                    </Navbar.Collapse>
                </Navbar>
            </Container>
        </>
    )
}

export default App
