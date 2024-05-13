import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import './new_chat.css';

export const NewChat = () => {
    return (
        <>
            <div className="mainContainer">
                <div className="mainWrapper">
                    <div className="titleInputContainer">
                        {/* <input type="text" className="titleInputBox" placeholder='Enter the title here' /> */}
                    </div>
                </div>
            </div>

            {/* <div className="user-container">
                <div className="user-wrapper">
                    <div className="username-title" id='username-title'></div>
                    <div className="email-title" id='email-title'></div>
                    <div className="create-chat">
                        {/* <input className="inputButton" type="button" /> */}
                        {/* <button className="create-chat-button" id='create-chat-button'><i class="create-chat-image fa-solid fa-message"></i></button> */}
            
        </>
    );




    // const navigate = useNavigate();
    // const { id } = useParams();

    // useEffect(() => {
    //     const user = JSON.parse(localStorage.getItem("user"));
    
    //     fetch('/verify', {
    //         method: "POST",
    //         headers: { 
    //             "jwt-token": user.token
    //         }
    //     })
    //     .then(r => r.json())
    //     .then(r => {
    //         if (r.message === "success") {
    //             fetch('/read-username', {
    //                 method: "POST",
    //                 headers: {
    //                     'Content-Type': "application/json"
    //                 },
    //                 body: JSON.stringify({id: parseInt(id)})
    //             })
    //             .then(res => res.json())
    //             .then(res => {
    //                 document.getElementById("username-title").innerHTML = res.message ? "NO USERNAME" : res.username;
    //                 document.getElementById("create-chat-button").style.display = res.message ? "none" : "inline";
    //             });

    //             fetch('/read-email', {
    //                 method: "POST",
    //                 headers: {
    //                     'Content-Type': "application/json"
    //                 },
    //                 body: JSON.stringify({id: parseInt(id)})
    //             })
    //             .then(res => res.json())
    //             .then(res => {
    //                 document.getElementById("email-title").innerHTML = res.message ? "NO EMAIL" : res.email;
    //                 document.getElementById("create-chat-button").style.display = res.message ? "none" : "inline";
    //             });
    //         }
    //         else {
    //             navigate('/login');
    //         }
    //     })
    //   }, []);

    // return (
    //     <>
    //         {/* <div className="username-title">{ id }</div> */}

    //         <div className="user-container">
    //             <div className="user-wrapper">
    //                 <div className="username-title" id='username-title'></div>
    //                 <div className="email-title" id='email-title'></div>
    //                 <div className="create-chat">
    //                     {/* <input className="inputButton" type="button" /> */}
    //                     <button className="create-chat-button" id='create-chat-button'><i class="create-chat-image fa-solid fa-message"></i></button>
    //                 </div>
    //             </div>
    //         </div>
    //     </>
    // );
}
