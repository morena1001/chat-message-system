import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './login.css';


export const Login = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [loginError, setLoginError] = useState('');

    const navigate = useNavigate();

    const onButtonClick = () => {
        setUsernameError('');
        setPasswordError('');
        setLoginError('');
        let usernameErrorCheck = false;
        let passwordErrorCheck = false;

        if ('' === username) {
            setUsernameError("Please enter your username");
            usernameErrorCheck = true;
        }

        else if (/[^a-z0-9]/.test(username)) {
            setUsernameError('Please enter a valid username');
            usernameErrorCheck = true;
        }
    
        if ('' === password) {
            setPasswordError('Please enter a password');
            passwordErrorCheck = true;
        }
        else if (/\s/.test(password)) {
            setPasswordError('Please enter a valid password');
            passwordErrorCheck = true;
        }
        else if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer');
            passwordErrorCheck = true;
        }

        if (!usernameErrorCheck && !passwordErrorCheck) {
            checkAccountExists((accountExists) => {
                if (accountExists) {
                    logIn();
                }
                else {
                    setLoginError('Account does not exists. Try again');
                }
            });  
        }  
    }

    const checkAccountExists = (callback) => {
        fetch('/check-account', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ username })
        })
        .then((r) => r.json())
        .then((r) => {
            callback(r.userExists);
        });
    }

    const logIn = () => {
        fetch('/auth', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        })
        .then((r) => r.json())
        .then((r) => {
            if ('success' === r.message) {
                localStorage.setItem('user', JSON.stringify({ username, token: r.token }));
                props.setLoggedIn(true);
                navigate('/');
            }
            else {
                setLoginError('Password is incorrect. Try again');
            }
        })
    }

    useEffect(() => {
        if(props.loggedIn) {
            navigate("/");
        }
    })
    
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
                        <input className="inputBox" type="text" id='password' placeholder='Enter your password here' onChange={
                            (e) => {
                                setPassword(e.target.value); 
                                // e.target.value = e.target.value.replace(/./g, "*");
                        }} />
                        <label className="errorLabel">{passwordError}</label>
                    </div>
                    <div className="registerLink">
                        <label className="registerLabel">Don't have an account?</label>
                        <Link className='link' to='/register'>Register</Link>
                    </div>
                    <div className="inputContainer">
                        <input className="inputButton" type="button" onClick={onButtonClick} value={'Log in'} />
                        <label className="loginErrorLabel">{loginError}</label>
                    </div>
                </div>
            </div>
        </>
    );
}
