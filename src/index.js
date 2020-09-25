import React, { useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';


const App = () => {
    const [token, setToken] = useState('');

    useEffect(() =>{
        const query = window.location.search.substring(1);
        const token = query.split('access_token=')[1];
        const tokenStorage = localStorage.getItem('token');

        if(tokenStorage) {
            setToken(tokenStorage);
        };

        if(token) {
            setToken(token);
            localStorage.setItem('token', token);
        };
        
    }, [])
    
    const gitHubLogin = () => {
        window.location.replace('https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&redirect_uri=http://localhost:3000/api/github/callback')
    }

    const logOut = () => {
        setToken('');
        localStorage.clear();
        window.location = '/'
    }

    const getUser = async () => {
        const {data} = await axios.get('/api/github/getUser', {params: {token}})
        console.log(data)
    }

    return(
        <div>
            <h1>GitCheck FSA</h1>
            <h3>Access Token: {token ? token : `No Token Set`}</h3>
            {
                token ? 
                    <div>
                        <button onClick={logOut}>Log Out</button>
                        <button onClick={getUser}>Get User</button>
                    </div> : 
                    <div>
                        <a href="https://github.com/login/oauth/authorize?client_id=2d9066f1cc065f4ad732&redirect_uri=http://localhost:3000/api/github/callback">Login with gitHub</a>
                        <button onClick={gitHubLogin}>GitHub Login</button>
                        
                    </div>
            }
        </div>
    )
}

const root = document.querySelector('#root');

ReactDOM.render(<App />, root);