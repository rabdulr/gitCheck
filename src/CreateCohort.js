import React, {useState, useEffect} from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Select from 'react-dropdown-select';

const CreateCohort = ({allCohorts, setAllCohorts}) => {

    const [cohortName, setCohortName] = useState('');
    const [studentListArr, setStudentListArr] = useState([]);
    const [projectList, setProjectList] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [dueDate, setDueDate] = useState('');

    const onSubmit = (ev) => {
        ev.preventDefault();
    };

    const addProject = () => {
        const newProject = {
            name: projectName,
            date: dueDate
        }
        setProjectList([...projectList, newProject]);
        setProjectName('');
        setDueDate('');
    }

    const createCohort = () => {
        const students = studentListArr.map(student => student.value);
        const value = {
            students,
            projects: projectList,
            cohortData: []
        };
        const newCohort = {
            cohort: cohortName,
            value
        };
        setAllCohorts([...allCohorts, newCohort]);
    };

    return (
        <div>
            <Row>
                <label>
                    Cohort Name:
                    <input type="text" placeholder="Cohort Name" value={cohortName} onChange={ev => setCohortName(ev.target.value)}/>
                </label>
            </Row>
            <Row>
                <Select
                    multi
                    create
                    options={studentListArr}
                    onCreateNew={item => setStudentListArr([...studentListArr, item])}
                    values={[]}
                    backspaceDelete={true}
                    onChange={values => setStudentListArr(values)}
                    placeholder="Add GitHub Usernames" 
                    style={{width: '100%'}} />
            </Row>
            <Row>
                <h3>Add Project</h3>
                <label>
                    Project Name:
                    <input type='text' placeholder='Project Name' value={projectName} onChange={ev => setProjectName(ev.target.value)} />
                </label>
                <label>
                    Project Due Date:
                    <input type='text' placeholder='1/1/20' value={dueDate} onChange={ev => setDueDate(ev.target.value)} />
                </label>
                <button type="button" onClick={addProject}>Add Project</button>
                <h3>Project List</h3>
                <ul>
                    {
                        projectList.length > 0 ? 
                            projectList.map(project => {return (
                                <li key={project.name + project.date}>
                                    {project.name}, {project.date}
                                </li>
                            )}) : <div>No projects set</div>
                    }
                </ul>
            </Row>
            <Row>
                <button type="button" onClick={createCohort}>Create Cohort</button>
            </Row>
        </div>
    )
}

export default CreateCohort;
