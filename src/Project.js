import React from 'react';
import File from './File';


const Project = ({commit}) => {

    const {stats, files} = commit;

    return (
        <div>
            <li>Commit Message: {commit.commit.message}</li>
            <ul>
                <li>sha: {commit.sha}</li>
                <li>Date: {commit.commit.author.date}</li>
                <li>Total changes: {stats.total}</li>
                <ul>
                    <li>Additions: {stats.additions}</li>
                    <li>Deletions: {stats.deletions}</li>
                </ul>
                <li>File Changes:</li>
                    <ul>
                        {
                            files.length > 0 ? files.map((file, idx) => {
                                // Need an actual key at some point
                                return (
                                    <div key={Math.random() * idx}>
                                        <File file={file} />
                                    </div>
                                )
                            }) : ''
                        }
                    </ul>
            </ul>
        </div>
    )
}

export default Project;