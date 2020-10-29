import React from 'react';
import Card from 'react-bootstrap/Card';

const Main = ({username}) => {
    return (
        <Card>
            <Card.Header>Welcome{username ? `, ${username}` : ''}!</Card.Header>
            <Card.Body>
                <Card.Title>
                    About gitCheck:
                </Card.Title>
                <Card.Text>
                    gitCheck was developed to measure engagement of online coding classes that utilize GitHub. Specifically, measuring class engagement through commits made by students from forked or public projects. These commits are then averaged from the start date of the project to show student engagement compared to class average.
                </Card.Text>
                <Card.Text>
                    Check the engagement amongst multiple students, members, or just your own account and projects.
                </Card.Text>
                {
                    username ? <>                
                    <Card.Title>
                    Using gitCheck
                    </Card.Title>
                    <Card.Text>
                        In order to access repo information, you will need -
                    </Card.Text>
                    <ol>
                        <li>Admin privileges to the repos you are wanting to access or repos are public</li>
                        <li>Exact names and start dates of forked repos</li>
                        <li>List of student GitHub usernames</li>
                    </ol>
                    <Card.Text>
                        I would recommend testing with your GitHub user and a project to verify data is obtained before adding more. Depending on the amount of data being retrieved and processed, the page may take some time to load.
                    </Card.Text> </> : 
                    <>
                    <Card.Title>
                        Features:
                    </Card.Title>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                General view of all classes and average commit -
                            </Card.Text>
                            <Card.Img variant='bottom' src='assets/overview.png' />
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <Card.Text>
                                View student commits -
                            </Card.Text>
                            <Card.Img variant='bottom' src='assets/student-view.png' />
                        </Card.Body>
                    </Card>
                    <Card.Text>
                        Login with your GitHub account to check!
                    </Card.Text>
                    </>
                }

                <Card.Text>
                    This application is still under development which may result in unexpected experiences.
                </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Main
