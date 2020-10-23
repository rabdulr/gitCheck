import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import { Scrollbars } from 'react-custom-scrollbars';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';

import Student from './Students';
import StudentCard from './StudentCard'

const ClassStudentView = ({cohortData, avgData}) => {
    const [studentInfo, setStudentInfo] = useState(cohortData[0]); 
    return (
        <Row style={{marginTop: '0'}}>
            <Col md={1.5} style={{paddingRight: '0', paddingLeft: '0'}}>
                <Scrollbars style={{height: 900, marginTop: 0, width: 150}} autoHide={true}>
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
            <Col style={{paddingRight: '0', paddingLeft: '0'}}>
                    {
                        studentInfo ?
                            <Student student={studentInfo} avgData={avgData} />
                            : <div>No Student Selected</div>
                    }
            </Col>
        </Row>
    )
}

export default ClassStudentView
