import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Card from 'react-bootstrap/Card';

const Loading = () => {
    return (
        <Card is='loading' style={{width: '100%', height: '100%'}}>
            <Card.Body className='pageLoading text-center'>
            <Spinner animation='border' className='pageLoading' />
            </Card.Body>
        </Card>
    )
}

export default Loading;
