import React from 'react';
import Card from 'react-bootstrap/Card';

const StudentCard = ({student, avgData}) => {
    const {repository, name} = student;
    return (
        <div>
            {repository.name || repository.login}
        </div>
    )
};

export default StudentCard;