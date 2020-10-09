import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Scrollbars } from 'react-custom-scrollbars';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import StudentCard from './StudentCard';
import Student from './Student';


const ClassView = ({cohort, avgData}) => {
    const {cohortData} = cohort;
    const [studentInfo, setStudentInfo] = useState();

    return (
        <Row>
        <Col xs={2}>
            <Scrollbars style={{height: 650, marginTop: 0}} autoHide={true}>
                {   
                    cohortData.map(student => {
                        return(
                            <ListGroupItem action onClick={() => setStudentInfo(student)}>
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
                studentInfo ?
                    <Student student={studentInfo} avgData={avgData}/>
                    : <h4>No info</h4>
            }
                </Row>
        </Col>
    </Row>
    )
}

export default ClassView;