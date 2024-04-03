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
        setup();
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
            <div className="clientContainer">
                <div className="leftSideContainer">
                    <div className="leftSideWrapper">
                        <div className="headerContainer">
                            <div className="headerWrapper">
                                <div className="usernameTitle">{username}</div>
                                <div className="newChat">
                                    <button className="newChatButton" id='newChatButton'><i class="fa-solid fa-plus icon"></i></button>
                                </div>
                                <div className="options">
                                    <button className="optionsButton" id='optionsButton'><i class="fa-solid fa-ellipsis-vertical optionsIcon"></i></button>
                                    {/* <i class="fa-solid fa-bars"></i> */}
                                </div>
                            </div>
                        </div>

                        <div className="searchAndFilterContainer">
                            <div className="searchAndFilterWrapper">
                                <input type="text" className="searchBar" />
                                <div className="filter">
                                    <button className="filterButton" id='filterButton'><i class="fa-solid fa-message"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="rightSideContainer">
                    <div className="rightSideWrapper">
                        <div className="headerContainer">
                            <div className="headerWrapper">
                                <div className="chatTitle">Kira Linderg</div>
                                <div className="chatOptions">
                                    <button className="chatOptionsButton" id='optionsButton'><i class="fa-solid fa-ellipsis-vertical chatOptionsIcon"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="headerContainer">
                <div className="headerWrapper">
                    <input type="button" value={"LOG OUT"} onClick={onButtonClick} />
                </div>
            </div> */}
        </>
    );
}

function setup() {
    document.getElementById("newChatButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById("optionsButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById("filterButton").addEventListener("click", function(e) {
        e.preventDefault();
    });
}
