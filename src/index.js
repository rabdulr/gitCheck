import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {BrowserRouter} from 'react-router-dom';

const root = document.querySelector('#root');

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, root)
