import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './register.css';


export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [registerError, setRegisterError] = useState('');

    const navigate = useNavigate();

    const onButtonClick = () => {
        setEmailError('');
        setUsernameError('');
        setPasswordError('');
        setRegisterError('');
        let usernameErrorCheck = false;
        let passwordErrorCheck = false;
        let emailErrorCheck = false;

        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            setEmailError('Please enter a valid email');
            emailErrorCheck = true;
        }

        if ('' === username || /[^a-z0-9]/.test(username)) {
            setUsernameError('Please enter a valid username');
            usernameErrorCheck = true;
        }
    
        if ('' === password || /\s/.test(password)) {
            setPasswordError('Please enter a valid password');
            passwordErrorCheck = true;
        }
        else if (password.length < 7) {
            setPasswordError('The password must be 8 characters or longer');
            passwordErrorCheck = true;
        }

        if (!emailErrorCheck && !usernameErrorCheck && !passwordErrorCheck ) {
            checkAccountExists((accountExists) => {
                if (!accountExists) {
                    register();
                }
                else {
                    setRegisterError('Account with email and/or username already exists. Try again');
                }
            });  
        }
    };

    const checkAccountExists = (callback) => {
        fetch('/check-repeating-info', {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email, username })
        })
        .then((r) => r.json())
        .then((r) => {
            callback(r.userExists);
        });
    };

    const register = () => {
        fetch('/create-account', {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify({ email, username, password })
        })
        .then((r) => r.json())
        .then((r) => {
            if ('success' === r.message) {
                localStorage.setItem('user', JSON.stringify({ email, token: r.token }));
                props.setUsername(username);
                props.setLoggedIn(true);
                navigate('/', props)
            }
            else {
                setRegisterError('Error occured. Try again');
            }
        })
    };

    // const logIn = () => {
    //     fetch('/auth', {
    //         method: "POST",
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({ email, password })
    //     })
    //     .then((r) => r.json())
    //     .then((r) => {
    //         console.log(r);
    //         if ('success' === r.message) {
    //             localStorage.setItem('user', JSON.stringify({ email, token: r.token }))
    //             props.setLoggedIn(true)
    //             props.setEmail(email)
    //             navigate('/')
    //         }
    //         else {
    //             window.alert('Wrong email or password')
    //           }
    //     })
    // }
    
    return (
        <>
            <div className="mainContainer">
                <div className="mainContainerWrapper">
                    <div className="titleContainer">
                        <div className='title'>Register</div>
                    </div>
                    <div className="inputContainer">
                        <input className="inputBox" type="text" value={email} placeholder='Enter your email here' onChange={(e) => setEmail(e.target.value)} />
                        <label className="errorLabel">{emailError}</label>
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
                        <label className="loginLabel">Already have an account?</label>
                        <Link className='link' to='/login'>Login</Link>
                    </div>
                    <div className="inputContainer">
                        <input className="inputButton" type="button" onClick={onButtonClick} value={'Register'} />
                        <label className="registerErrorLabel">{registerError}</label>
                    </div>
                </div>
            </div>
        </>
    );
}
