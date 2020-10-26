import React, {useState, useEffect} from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import {useParams} from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

import ClassData from './ClassData';
import ClassStudentView from './ClassStudentsView';
import CreateCohort from './CreateCohort';
// import { FilterList } from '@material-ui/icons';

const ClassInfo = ({updateList, allCohorts, setAllCohorts}) => {
    const [key, setKey] = useState('classData');
    const [cohortClass, setCohortClass] = useState({});
    const {id} = useParams();

    const getCohortData = async(projects, students) => {
        const {data: {returnedAvgData, cohort}} = await axios.post('/api/github/getUsers', {projects, students});
        return {returnedAvgData, cohort}
    };
    
    useEffect(() => {
        if (allCohorts.length > 0) {
            const filteredList = allCohorts.find(cohort => cohort.id === id*1);
            if (!filteredList.cohortAvg || !filteredList.cohortData) {
                getCohortData(filteredList.projects, filteredList.students)
                    .then(response => {
                        const {returnedAvgData, cohort} = response;
                        filteredList.cohortAvg = returnedAvgData;
                        filteredList.cohortData = cohort;
                        setCohortClass(filteredList);
                        setAllCohorts(allCohorts.map(cohort => {
                            if ( cohort.id === filteredList.id) return filteredList;
                            return cohort
                        }))
                    });
            } else {
                    setCohortClass(filteredList)
            }
        }
    }, [id]);

    return (
        <>
        {
            cohortClass.cohortAvg && cohortClass.cohortData ?
            <Tabs defaultActiveKey="classData" id="data-navigation" activeKey={key} onSelect={k => setKey(k)}>
                <Tab eventKey="classData" title="Class Data">
                    <ClassData avgData={cohortClass.cohortAvg} />
                </Tab>
                <Tab eventKey="classStudentView" title="Student List">
                    <ClassStudentView avgData={cohortClass.cohortAvg} cohortData={cohortClass.cohortData} />
                </Tab>
                {/* <Tab eventKey="classEdit" title="Edit Class">
                    <CreateCohort allCohorts={allCohorts} setAllCohorts={setAllCohorts} cohortClass={cohortClass} setKey={setKey} updateList={updateList} setCohortClass={setCohortClass} />
                </Tab> */}
            </Tabs> 
            : <Spinner animation='border' />
        }
        </>
    )
}

export default ClassInfo;
