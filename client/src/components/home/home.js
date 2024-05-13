import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './home.css';

var userId;

export const Home = (props) => {
    // const [togglePanel, setTogglePanel] = useState(false);
    const togglePanel = useRef(false);
    const { loggedIn, username } = props;
    const navigate = useNavigate();
    let face = "( |ᆺ| )";
    let meow = "nyaaa";

    const newChatButtonClick = () => {
        navigate('/new_chat');
    }
    
    const onButtonClick = () => {
        if (loggedIn) {
            localStorage.removeItem("user");
            props.setLoggedIn(false);
            navigate("/login");
        }
    };

    const toggleChatPanel = () => {
        togglePanel.current = !togglePanel.current;
        document.getElementById('chatInfoPanelContainer').style.display = togglePanel.current ? 'flex' : 'none';
    }

    useEffect(() => {
        if (!loggedIn) {
            navigate("/login");
        }
        setup(username, toggleChatPanel);
    }, []);

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
                                        <button className="newChatButton" id='newChatButton' onClick={newChatButtonClick}><i className="fa-solid fa-plus icon"></i></button>
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
                                <div className="chatTitle" id='chatTitle'></div>
                                <div className="chatOptions">
                                    <button className="chatOptionsButton" id='chatOptionsButton' onClick={toggleChatPanel}><i className="fa-solid fa-ellipsis-vertical chatOptionsIcon"></i></button>
                                </div>
                                <div className="chatInfoPanelContainer" id='chatInfoPanelContainer'>
                                    <div className="chatInfoPanel">
                                        <div className="chatInfoPanelHeader">
                                            <button className="panelChatOptionsButton" id='panelCloseButton' onClick={toggleChatPanel}><i className="fa-solid fa-x chatPanelIcon"></i></button>
                                            <div className="chatTitlePanel" id='chatTitlePanel'>
                                            </div>
                                        </div>
                                        <div className="chatInfoPanelMembers">
                                            <div className="chatInfoPanelMembersTitle">
                                                Members
                                            </div>
                                            <div className="chatInfoPanelMembersContainer" id='chatInfoPanelMembersContainer'>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="groupChatMessagesContainer" id='groupChatMessagesContainer'>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender"></div>
                                <div className="messageTimeStamp">
                                    <span className="timeStampSpan"></span>
                                    <button className="editMessageButton" id='editMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender"></div>
                                <div className="messageTimeStamp">
                                    <span className="timeStampSpan"></span>
                                    <button className="editMessageButton" id='editMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender"></div>
                                <div className="messageTimeStamp">
                                    <span className="timeStampSpan"></span>
                                    <button className="editMessageButton" id='editMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender"></div>
                                <div className="messageTimeStamp">
                                    <span className="timeStampSpan"></span>
                                    <button className="editMessageButton" id='editMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                            </div>
                        </div>
                        <div className="singleMessage" id='singleMessage'>
                            <div className="messageHeader">
                                <div className="messageSender"></div>
                                <div className="messageTimeStamp">
                                    <span className="timeStampSpan"></span>
                                    <button className="editMessageButton" id='editMessageButton'><i className="fa-solid fa-pencil editMessageIcon"></i></button>
                                </div>
                            </div>
                            <div className="messageContent">
                            </div>
                        </div>
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

function setup(username, toggleChatPanel) {
    document.getElementById("newChatButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById("optionsButton").addEventListener("click", function (e) {
        e.preventDefault();
    });
    document.getElementById('chatOptionsButton').addEventListener('click', function(e) {
        e.preventDefault();
    });
    document.getElementById('panelCloseButton').addEventListener("click", function(e) {
        e.preventDefault();
    });
    document.getElementById("filterButton").addEventListener("click", function(e) {
        e.preventDefault();
    });

    document.getElementById('chatOptionsButton').style.display = 'none';

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
                            createChatListItem(res3, toggleChatPanel);
                        });
                    }
                    else {
                        createChatListItem(res3, toggleChatPanel);
                    }
                });
            });
        });
    });
}

function createChatListItem(group, toggleChatPanel) {
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
            groupItem.onclick = function() { loadChatMessages(group, toggleChatPanel) };

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
            groupItem.onclick = function() { loadChatMessages(group, toggleChatPanel) };

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
            document.getElementById('groupChatButtonContainer').insertBefore(groupItem, document.getElementById('endOfChatsList'));
        }
    })
}

function loadChatMessages(group, toggleChatPanel) {
    document.getElementById('chatOptionsButton').style.display = 'inline';
    document.getElementById('chatTitle').innerHTML = group.name;
    document.getElementById('chatTitlePanel').innerHTML = group.name;

    if (document.getElementById('chatInfoPanelContainer').style.display === "flex") {
        toggleChatPanel();
    }

    // document.getElementById('groupChatMessagesContainer').innerHTML = "";
    // MAKE IT SO THAT AFTER A MESSAGE IS CREATED, DON'T ERASE IT, AND KEEP A MAX OF 5. 

    fetch('/read-group-info', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: group.id })
    })
    .then((res) => res.json())
    .then((res) => {
        document.getElementById('chatInfoPanelMembersContainer').innerHTML = "";
        res.members.forEach(element => {
            if (element !== userId) {
                fetch('/read-username', {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: element })
                })
                .then((res2) => res2.json()) 
                .then((res2) => {
                    let adminStatus = res.admins.includes(element);

                    let memberItem = document.createElement("div");
                    memberItem.className = "memberItem";

                    let memberLink = document.createElement('a');
                    memberLink.className = "userProfileLink";
                    memberLink.href="/profile/" + element;
                    memberLink.innerHTML = res2.username;

                    let memberStatus = document.createElement('div');
                    memberStatus.className = "memberStatus";
                    memberStatus.innerHTML = adminStatus ? "Admin" : "";

                    memberItem.appendChild(memberLink);
                    memberItem.appendChild(memberStatus);
                    
                    document.getElementById('chatInfoPanelMembersContainer').appendChild(memberItem);
                });
            }
        })
    })


    fetch('/read-chat-messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({ id: group.id })
    })
    .then((res) => res.json()) 
    .then((res) => {
        // res.messages.forEach(element => {
        //     // createMessageItem(element);
        //     loadMessageItem(element);
        // });

        for (let i = 0; i < 5; i++) {
            if (i >= res.messages.length) {
                resetMessageItem(i);
            }
            else {
                loadMessageItem(res.messages[i], i);
            }
        }
    });
}

function loadMessageItem(messageInfo, i) {
    var sender, timeStamp;
    var messageElementItem = document.getElementById('groupChatMessagesContainer').children[i];

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

        messageElementItem.className = userId === messageInfo.userId ? "singleMessage userMessage" : "singleMessage";
        messageElementItem.firstElementChild.firstElementChild.innerHTML = userId === messageInfo.userId ? "You" : sender;
        messageElementItem.firstElementChild.lastElementChild.firstElementChild.innerHTML = timeStamp;
        messageElementItem.firstElementChild.lastElementChild.lastElementChild.style.display = userId === messageInfo.userId ? "inline" : "none";
        messageElementItem.lastElementChild.innerHTML = messageInfo.content;
        messageElementItem.style.display = "inline";
    });
}

function resetMessageItem(i) {
    var messageElementItem = document.getElementById('groupChatMessagesContainer').children[i];

    messageElementItem.className = "singleMessage";
    messageElementItem.firstElementChild.firstElementChild.innerHTML = "";
    messageElementItem.firstElementChild.lastElementChild.firstElementChild.innerHTML = "";
    messageElementItem.firstElementChild.lastElementChild.lastElementChild.style.display = "none";
    messageElementItem.lastElementChild.innerHTML = "";
    messageElementItem.style.display = "none";
}

function createMessageItem(messageInfo) {
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

        document.getElementById('groupChatMessagesContainer').appendChild(messageItem);
    });
}
