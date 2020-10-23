import React, {useState, useEffect} from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {useParams} from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';

import ClassData from './ClassData';
import ClassStudentView from './ClassStudentsView';
import CreateCohort from './CreateCohort';

const ClassInfo = ({updateList, allCohorts, setAllCohorts}) => {
    const [key, setKey] = useState('classData');
    const [cohortClass, setCohortClass] = useState();
    const {id} = useParams();

    useEffect(() => {
        if (allCohorts.length > 0) {
            const filteredList = allCohorts.find(cohort => cohort.id === id*1);
            setCohortClass(filteredList)
        }
    }, []);

    return (
        <>
        {
            cohortClass ?
            <Tabs defaultActiveKey="classData" id="data-navigation" activeKey={key} onSelect={k => setKey(k)}>
                <Tab eventKey="classData" title="Class Data">
                    <ClassData avgData={cohortClass.value.cohortAvg} />
                </Tab>
                <Tab eventKey="classStudentView" title="Student List">
                    <ClassStudentView avgData={cohortClass.value.cohortAvg} cohortData={cohortClass.value.cohortData} />
                </Tab>
                <Tab eventKey="classEdit" title="Edit Class">
                    <CreateCohort allCohorts={allCohorts} setAllCohorts={setAllCohorts} cohortClass={cohortClass} setKey={setKey} updateList={updateList} setCohortClass={setCohortClass} />
                </Tab>
            </Tabs> : <Spinner animation="border" />
        }
        </>
    )
}

export default ClassInfo;
