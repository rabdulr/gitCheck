import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import { Scrollbars } from 'react-custom-scrollbars';
import Col from 'react-bootstrap/Col';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import Loading from './Loading';
import Form from 'react-bootstrap/Form';

import Student from './Student';
import StudentCard from './StudentCard'

const ClassStudentView = ({avgData, cohortData}) => {
    const [studentInfo, setStudentInfo] = useState({});
    const [pageLoad, setPageLoad] = useState(true)
    const [studentList, setStudentList] = useState([]);
    const [studentSearch, setStudentSearch ] = useState('');
    const [projectSearch, setProjectSearch] = useState('')

    useEffect(() => {
        setStudentList(cohortData)
        setStudentInfo(cohortData[0]);
        setPageLoad(false);
    }, [cohortData])

    useEffect(() => {
        if (!studentSearch) {
            setStudentList(cohortData);
        } else {
            const filteredList = studentList.filter(filterStudent => filterStudent.repository.login.toLowerCase().includes(studentSearch.toLowerCase()))
            setStudentList(filteredList);
            setStudentInfo(filteredList[0])
        }
    }, [studentSearch])

    return (
        <>
        <Row style={{marginTop: '0', marginBottom: '0'}}>
        <Col md={1.5} style={{paddingRight: '0', paddingLeft: '0', width: '166px'}}>
            <Form.Control type="text" placeholder="Search Students" value={studentSearch} onChange={ev => setStudentSearch(ev.target.value)} />
        </Col>
        <Col style={{paddingRight: '0', paddingLeft: '0'}}>
            <Form.Control type="text" placeholder="Search Projects" value={projectSearch} onChange={ev => setProjectSearch(ev.target.value)} />
        </Col>
        </Row>
        <Row style={{marginTop: '0'}}>
            {
                pageLoad ? <Loading /> :
                <>
                    <Col md={1.5} style={{paddingRight: '0', paddingLeft: '0'}}>
                    <Scrollbars style={{height: 900, marginTop: 0, width: 150}} autoHide={true}>
                        {
                            studentList.map(student => {
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
                                <Student student={studentInfo} avgData={avgData} projectSearch={projectSearch} />
                                : <div>No Student Selected</div>
                        }
                </Col>
                </>
            }
        </Row>
        </>
    )
}

export default ClassStudentView
