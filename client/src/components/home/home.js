import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

var userId;

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

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        }
        setup(username);
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
                                <div className="chatTitle" id='chatTitle'>Kira Linderg</div>
                                <div className="chatOptions">
                                    <button className="chatOptionsButton" id='optionsButton'><i className="fa-solid fa-ellipsis-vertical chatOptionsIcon"></i></button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="groupChatMessagesContainer" id='groupChatMessagesContainer'>
                        {/* <div className="singleMessage userMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender">
                                    You
                                </div>
                                <div className="messageTimeStamp">
                                    11:20 pm
                                    <button className="EditMessageButton" id='EditMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                                I feel alone
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender">
                                    Kira Linderg
                                </div>
                                <div className="messageTimeStamp">
                                    11:23 pm
                                </div>
                            </div>
                            <div className="messageContent">
                                me too.
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender">
                                    Kira Linderg
                                </div>
                                <div className="messageTimeStamp">
                                    11:23 pm
                                </div>
                            </div>
                            <div className="messageContent">
                                Want to feel alone together?
                            </div>
                        </div> */}
                    </div>
                    <div className="newMessageContainer">
                            <input type="text" className="newMessageTextBox" />
                            <button className="NewMessageSendButton" id='NewMessageSendButton'><i className="fa-solid fa-paper-plane newMessageSendIcon"></i></button>
                    </div>
                </div>
            </div>
        </>
    );
}

function setup(username) {
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
        userId = res1.id;
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
                            createChatListItem(res3);
                        });
                    }
                    else {
                        createChatListItem(res3);
                    }
                });
            });
        });
    });
}

function createChatListItem(group) {
    fetch('/read-latest-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ id: group.id })    
    })
    .then((res) => res.json())
    .then((res) => {
        if (res.message) {
            let groupItem = document.createElement('div');
            groupItem.className = "group";
            groupItem.id = group.id;
            groupItem.onclick = function() { loadChatMessages(group) };

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

            let groupItem = document.createElement('div');
            groupItem.className = "group";
            groupItem.id = group.id;
            groupItem.onclick = function() { loadChatMessages(group) };

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

function loadChatMessages(group) {
    document.getElementById('chatTitle').innerHTML = group.name;
    document.getElementById('groupChatMessagesContainer').innerHTML = "";

    fetch('/read-chat-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ id: group.id })
    })
    .then((res) => res.json()) 
    .then((res) => {
        res.messages.forEach(element => {
            createMessageItem(element);
        });
    });
}

function createMessageItem(messageInfo) {
    // console.log(messageInfo);

    var sender, timeStamp;

    var hour, minute, period;
    let currentDay = new Date(Date.now());
    let dateTest = new Date(messageInfo.date);

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
        timeStamp = hour + ":" + minute + " " + period
    }
    else {
        let checkYesterday = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
        checkYesterday.setDate(checkYesterday.getDate() - 1);
        if (dateTest >= checkYesterday) {
            timeStamp = "Yesterday";
        }
        else {
            let checkWeek = new Date(currentDay.getFullYear(), currentDay.getMonth(), currentDay.getDate());
            checkWeek.setDate(checkWeek.getDate() - checkWeek.getDay());
            const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            if (dateTest >= checkWeek) {
                timeStamp = days[dateTest.getDay()];
            }
            else {
                timeStamp = dateTest.getDate() + "/" + dateTest.getMonth() + "/" + dateTest.getFullYear().toString().substring(2);
            }
        }
    }

    fetch('/read-username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: messageInfo.userId })
    })
    .then((res1) => res1.json())
    .then((res1) => {
        sender = res1.username;

        let messageItem = document.createElement('div');
        messageItem.className = userId === messageInfo.userId ? "singleMessage userMessage" : "singleMessage";
        messageItem.id = "singleMessage";

        let messageHeader = document.createElement('div');
        messageHeader.className = "messageHeader";

        let messageSender = document.createElement('div');
        messageSender.className = "messageSender";
        messageSender.innerHTML = userId === messageInfo.userId ? "You" : sender;
        
        let messageTimeStamp = document.createElement('div');
        messageTimeStamp.className = "messageTimeStamp";
        messageTimeStamp.innerHTML = timeStamp;

        let editMessageButton = document.createElement('button');
        editMessageButton.className = "editMessageButton";
        editMessageButton.id = "editMessageButton";

        let editMessageIcon = document.createElement('i');
        editMessageIcon.className = "fa-solid fa-pencil editMessageIcon";

        let messageContent = document.createElement('div');
        messageContent.innerHTML = messageInfo.content;

        editMessageButton.appendChild(editMessageIcon); 
        messageTimeStamp.appendChild(editMessageButton);
        messageHeader.appendChild(messageSender);
        messageHeader.appendChild(messageTimeStamp);
        messageItem.appendChild(messageHeader);
        messageItem.appendChild(messageContent);

        console.log(messageItem);
        document.getElementById('groupChatMessagesContainer').appendChild(messageItem);
    });
}





// readMessageSender(messageInfo).then(data => {
//     sender = data.username;
//     console.log(data.username);
// })
// let senderUsernamePromise = new Promise(function(resolve) {
    //     const res = fetch('/read-username', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         body: JSON.stringify({ id: messageInfo.userId })
    //     })
    //     .then((res) => res.json())
    //     .then((res) => { resolve(res) })
    // });

    // senderUsernamePromise.then(
    //     function(value) { sender = value.username }
    // )

    // console.log(sender);
// async function readMessageSender(e) {
//     // const response = await fetch("/shows");
//     // const data = await response.json();
//     // return data;

//     const res = await fetch('/read-username', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ id: e.userId })
//     });
//     const data = await res.json();
//     return data;
// }
