import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

export const Home = (props) => {
    const { loggedIn, username } = props;
    const navigate = useNavigate();

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        }
    });

    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            props.setLoggedIn(false);
            navigate("/login");
        }
    };

    return(
        <>
            <h1 className="title">HELLO WORLD</h1>
            <input type="button" value={"LOG OUT"} onClick={onButtonClick} />
        </>
    );
}
