import React from 'react';

const ClassInfo = () => {
    return (
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
        </Tabs>
    )
}

export default ClassInfo;
