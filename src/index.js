import React from 'react';
import ReactDOM from 'react-dom';

const App = () => {
    return(
        <div>
            <h1>GitCheck FSA</h1>
            <a href="https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&redirect_uri=http://localhost:3000/callback">Login with gitHub</a>
        </div>
    )
}

const root = document.querySelector('#root');

ReactDOM.render(<App />, root);