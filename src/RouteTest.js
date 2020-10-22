import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams
  } from "react-router-dom";
  
const RouteTest = () => {

    const {id} = useParams();
    return (
        <div>
            <h3>ID: {id}</h3>
        </div>
    )
}

export default RouteTest;
