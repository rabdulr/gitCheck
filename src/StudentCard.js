import React from 'react';

const StudentCard = ({student}) => {
    const {repository, name} = student;
    return (
        <div>
            {repository.name || repository.login}
        </div>
    )
};

export default StudentCard;
