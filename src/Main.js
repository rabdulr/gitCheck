import React from 'react';
import Card from 'react-bootstrap/Card';

const Main = ({username}) => {
    return (
        <Card>
            <Card.Header>Welcome, {username ? username : 'guest'}!</Card.Header>
            <Card.Body>
                <Card.Title>
                    About gitCheck:
                </Card.Title>
                <Card.Text>
                    gitCheck was developed to measure engagement of online coding classes that utilize GitHub. Specifically, measuring class engagement through commits made by students from forked projects. These commits are then averaged from the start date of the project to show student engagement compared to class average.
                </Card.Text>
                <Card.Text>
                    In order to access repo information, you will need -
                </Card.Text>
                <ol>
                    <li><a href='https://www.github.com'>GitHub</a> account</li>
                    <li>Admin privileges to the repos you are wanting to access</li>
                    <li>Exact names and start dates of forked repos</li>
                    <li>List of student GitHub usernames</li>
                </ol>
                <Card.Text>
                    This application is still under development which may result in bugs and issues.
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Main
