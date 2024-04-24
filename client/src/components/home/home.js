import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

export const Home = (props) => {
    const { loggedIn, username } = props;
    const navigate = useNavigate();
    let face = "( |ᆺ| )";
    let meow = "nyaaa";

    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            props.setLoggedIn(false);
            navigate("/login");
        }
    };

    const loadChatMessages = (e) => {
        console.log("LOADED MESSAGES " + e);
    };

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        }
        setup(username, loadChatMessages);
    });

    return(
        <>
            {/* <div className="headerContainer">
                <div className="headerWrapper">
                    <input type="button" value={"LOG OUT"} onClick={onButtonClick} />
                </div>
            </div> */}
            <div className="clientContainer">
                <div className="leftSideContainer">
                    <div className="leftSideWrapper">
                        <div className="headerContainer">
                            <div className="headerWrapper">
                                <div className="usernameTitle">{username}</div>
                                <div className="headerButtons">
                                    <div className="newChat">
                                        <button className="newChatButton" id='newChatButton'><i className="fa-solid fa-plus icon"></i></button>
                                    </div>
                                    <div className="options">
                                        <button className="optionsButton" id='optionsButton' onClick={onButtonClick}><i className="fa-solid fa-ellipsis-vertical optionsIcon"></i></button>
                                        {/* <i className="fa-solid fa-bars"></i> */}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="searchAndFilterContainer">
                            <div className="searchAndFilterWrapper">
                                <input type="text" className="searchBar" />
                                <div className="filter">
                                    <button className="filterButton" id='filterButton'><i className="fa-solid fa-message messageIcon"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="groupChatButtonContainer" id='groupChatButtonContainer'>
                        {/* <div className="group" onClick={loadChatMessages} >
                            <div className="groupChatButtonContainerTitle">
                                First Admin Group
                            </div>
                            <div className="mostRecentMessage">
                                <div className="message">
                                    NO WAY
                                </div>
                                <div className="timeStamp">
                                    1:52 pm
                                </div>
                            </div>
                        </div> */}
                        <div className=" endOfChatsList" id='endOfChatsList'> 
                            {face} 
                            <div className="meow">
                                {meow}
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
                                    <button className="chatOptionsButton" id='optionsButton'><i className="fa-solid fa-ellipsis-vertical chatOptionsIcon"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

function setup(username, loadChatMessages) {
    document.getElementById("newChatButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById("optionsButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById("filterButton").addEventListener("click", function(e) {
        e.preventDefault();
    });

    fetch('/read-user-id', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ username: username })
    })
    .then((res) => res.json())
    .then((res1) => {
        fetch('/read-groups', {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify({ id: res1.id })
        })
        .then((res) => res.json())
        .then((res2) => {
            res2.groups.forEach(element => {
                fetch('/read-group-info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: element })
                })
                .then((res) => res.json())
                .then((res3) => {
                    if (res3.name === "") {
                        fetch('/read-name', {
                            method: "POST",
                        headers: {
                            'Content-Type': "application/json"
                        },
                        body: JSON.stringify({ userId: res1.id, groupId: element })
                        })
                        .then((res) => res.json())
                        .then((res4) => {
                            res3.name = res4.user;
                            createChatListItem(res3, loadChatMessages);
                        });
                    }
                    else {
                        createChatListItem(res3, loadChatMessages);
                    }
                });
            });
        });
    });
}

function createChatListItem(group, loadChatMessages) {
    fetch('/read-latest-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ id: group.id })    
    })
    .then((res) => res.json())
    .then((res) => {
        var hour, minute, period, time;
        let currentDay = new Date(Date.now());
        let dateTest = new Date(res.latestMessage.date);

        if (dateTest.getFullYear() === currentDay.getFullYear() && dateTest.getMonth() === currentDay.getMonth() && dateTest.getDate() === currentDay.getDate()) {
            hour = dateTest.getHours();
            minute = dateTest.getMinutes();

            if (hour === 0) {
                hour = 12;
                period = "am";
            }
            else if (hour <= 11) {
                period = "am";
            }
            else if (hour === 12) {
                period = "pm";
            }
            else {
                hour -= 12;
                period = "pm";
            }
            time = hour + ":" + minute + " " + period
        }
        else {
            let checkYesterday = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            checkYesterday.setDate(checkYesterday.getDate() - 1);
            if (dateTest >= checkYesterday) {
                time = "Yesterday";
            }
            else {
                let checkWeek = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
                checkWeek.setDate(checkWeek.getDate() - checkWeek.getDay());
                const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                if (dateTest >= checkWeek) {
                    time = days[dateTest.getDay()];
                }
                else {
                    time = dateTest.getDate() + "/" + dateTest.getMonth() + "/" + dateTest.getFullYear().toString().substring(2);
                }
            }
        }
        

        if (res.message) {
            let groupItem = document.createElement('div');
            groupItem.className = "group";
            groupItem.id = group.id;
            groupItem.onclick = loadChatMessages;

            let title = document.createElement('div');
            title.className = 'groupChatButtonContainerTitle';
            title.innerHTML = group.name;

            let mostRecentMessage = document.createElement('div');
            mostRecentMessage.className = 'mostRecentMessage';

            let message = document.createElement('div');
            message.className = 'message';
            message.innerHTML = "There are no previous messages";

            let timeStamp = document.createElement('div');
            timeStamp.className = 'timeStamp';

            mostRecentMessage.appendChild(message);
            mostRecentMessage.appendChild(timeStamp);
            groupItem.appendChild(title);
            groupItem.appendChild(mostRecentMessage);
            // console.log(groupItem);
            document.getElementById('groupChatButtonContainer').insertBefore(groupItem, document.getElementById('endOfChatsList'));
        }
        else {
            let groupItem = document.createElement('div');
            groupItem.className = "group";
            groupItem.id = group.id;
            groupItem.onclick = loadChatMessages;

            let title = document.createElement('div');
            title.className = 'groupChatButtonContainerTitle';
            title.innerHTML = group.name;

            let mostRecentMessage = document.createElement('div');
            mostRecentMessage.className = 'mostRecentMessage';

            let message = document.createElement('div');
            message.className = 'message';
            message.innerHTML = res.latestMessage.content;

            let timeStamp = document.createElement('div');
            timeStamp.className = 'timeStamp';
            timeStamp.innerHTML = time;

            mostRecentMessage.appendChild(message);
            mostRecentMessage.appendChild(timeStamp);
            groupItem.appendChild(title);
            groupItem.appendChild(mostRecentMessage);
            // console.log(groupItem);
            document.getElementById('groupChatButtonContainer').insertBefore(groupItem, document.getElementById('endOfChatsList'));
        }
    })
}
