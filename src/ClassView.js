import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { Scrollbars } from 'react-custom-scrollbars';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend} from 'recharts';
import Select from 'react-dropdown-select';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import StudentCard from './StudentCard';
import Spinner from 'react-bootstrap/Spinner';
import Student from './Student';


const ClassView = ({cohort, avgData }) => {
    const {cohortData} = cohort;
    const [studentInfo, setStudentInfo] = useState();
    const [showAvg, setShowAvg] = useState(true);
    const [avgView, setAvgView] = useState();

    return (
        <Row>
        <Col xs={2}>
            <Scrollbars style={{height: 650, marginTop: 0}} autoHide={true}>
                {
                    cohortData.map(student => {
                        return (
                            <ListGroupItem action onClick={() => setStudentInfo(student)} key={student.name}>
                                    <StudentCard student={student} avgData={avgData} />
                            </ListGroupItem>
                        )
                    })
                }
            </Scrollbars>
        </Col>
        <Col>
            <Row>
                Breadcrumbs
            </Row>
            <Row>
                {
                    showAvg ?
                    <Col>
                        <h3>Class Data</h3>
                        <Select options={avgData} onChange={(values) => setAvgView(values[0].avgData)} labelField={'name'} valueField={'avgData'} />
                            { avgView ? 
                                <LineChart width={900} height={300} data={avgView} margin={{top: 5, right: 0, bottom: 5, left: 0}}>
                                    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                                    <XAxis dataKey="day" />
                                    <YAxis domain={[0, 'auto']}/>
                                    <Legend verticalAlign="top" height={10} />
                                    <Line type="monotone" dataKey="avgCommits" stroke="#82ca9d"/>
                                    <Tooltip />
                                </LineChart>
                                : <h4>NO DATA SELECTED</h4>
                        }
                    </Col>
                    : <Spinner animation="border" />
                }
            </Row>
            <Row>
                {
                    studentInfo ?
                        <Student student={studentInfo} avgData={avgData} />
                        : <div></div>
                }
            </Row>
        </Col>
        </Row>
    )
}

export default ClassView;
