import React from 'react';

const File = ({file}) => {
    return (
        <div>
            <li>File: {file.filename}</li>
            <ul>
                <li>Additions to file: {file.additions}</li>
                <li>Deletions to file: {file.deletions}</li>
                <li>Changes to file: {file.changes}</li>
            </ul>
        </div>
    )
};

export default File
