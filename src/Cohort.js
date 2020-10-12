import React, {useState, useEffect} from 'react';
import ReactJson from 'react-json-view';

const Cohort = ({cohort}) => {
    const [studentsList, setStudentList] = useState(cohort[0].value.students);
    const [projectList, setProjectList] = useState(cohort[0].value.projects);

    const removeStudent = (studentToRemove) => {
        const updatedList = studentsList.filter(student => student !== studentToRemove);
        setStudentList(updatedList)
    };


    return (
        <div>
            <ul>
                {
                    studentsList ? 
                    studentsList.map(student => {
                        return (
                            <li>
                                {student} <button onClick={() => removeStudent(student)}>remove</button>
                            </li>
                        )
                    }) : <h4>No Students</h4>
                }
            </ul>
        </div>
    )
}

export default Cohort;
