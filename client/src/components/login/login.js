import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';


export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const navigate = useNavigate();

    const onButtonClick = () => {
        // setUsernameError('');
        // setPasswordError('');

        // if ('' === username) {
        //     setUsernameError("Please enter your username");
        // }

        // else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(username)) {
        //     setUsernameError('Please enter a valid username');
        // }
    
        // if ('' === password) {
        //     setPasswordError('Please enter a password');
        // }
        // else if (password.length < 7) {
        //     setPasswordError('The password must be 8 characters or longer');
        // }

        // checkAccountExists((accountExcists) => {
        //     if (accountExcists) {
        //         logIn()
        //     }
        //     else {
        //         if (
        //             window.confirm('An account does not exist with this username: ' + username + '. Do you want to create a new account?',)
        //         ) {
        //             logIn()
        //         }
        //     }
        // });
    }

    // const checkAccountExists = (callback) => {
    //     fetch('/check-account', {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json"
    //         },
    //         body: JSON.stringify({ username })
    //     })
    //     .then((r) => r.json())
    //     .then((r) => {
    //         callback(r.userExists);
    //     });
    // }

    // const logIn = () => {
    //     fetch('/auth', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ username, password })
    //     })
    //     .then((r) => r.json())
    //     .then((r) => {
    //         console.log(r);
    //         if ('success' === r.message) {
    //             localStorage.setItem('user', JSON.stringify({ username, token: r.token }))
    //             props.setLoggedIn(true)
    //             props.setUsername(username)
    //             navigate('/')
    //         }
    //         else {
    //             window.alert('Wrong username or password')
    //           }
    //     })
    // }
    
    return (
        <>
            <div className="mainContainer">
                <div className="mainContainerWrapper">
                    <div className="titleContainer">
                        <div className='title'>Login</div>
                    </div>
                    <div className="inputContainer">
                        <input className="inputBox" type="text" value={username} placeholder='Enter your username here' onChange={(e) => setUsername(e.target.value)} />
                        <label className="errorLabel">{usernameError}</label>
                    </div>
                    <div className="inputContainer">
                        <input className="inputBox" type="text" value={password} placeholder='Enter your password here' onChange={(e) => setPassword(e.target.value)} />
                        <label className="errorLabel">{passwordError}</label>
                    </div>
                    <div className="registerLink">
                        <label className="registerLabel">Don't have an account?</label>
                        <Link className='link' to='/register'>Register</Link>
                    </div>
                    <div className="inputContainer">
                        <input className="inputButton" type="button" onClick={onButtonClick} value={'Log in'} />
                    </div>
                </div>
            </div>
        </>
    );
}
