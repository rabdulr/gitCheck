import React from 'react';

const StudentCard = ({student}) => {
    const {repository, name} = student;
    return (
        <div>
            {repository.login}
        </div>
    )
};

export default StudentCard;
