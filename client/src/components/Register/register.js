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

    const navigate = useNavigate();

    const onButtonClick = () => {
        // setEmailError('');
        // setPasswordError('');

        // if ('' === email) {
        //     setEmailError("Please enter your email");
        // }

        // else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        //     setEmailError('Please enter a valid email');
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
        //             window.confirm('An account does not exist with this email address: ' + email + '. Do you want to create a new account?',)
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
    //         body: JSON.stringify({ email })
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
                    </div>
                </div>
            </div>
        </>
    );
}
