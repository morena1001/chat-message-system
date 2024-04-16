var data = require('./db.json');

const path = require('path');
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const { type } = require('os');

const PORT = process.env.PORT || 3001;
const app = express();
const jwtSecretKey = "abcdefghijklmnopqrstuvwxyz1234567890"

app.use(express.static(path.resolve(__dirname, '../client/build')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// Authentication for logging in and registering
app.get("/api", (req, res) => {
  res.send('Auth API.\nPlease use POST /auth & POST /verify for authentication');
  console.log('Auth API.\nPlease use POST /auth & POST /verify for authentication');
});

app.post("/auth", (req, res) => {
  const { username, password } = req.body;
  const user = data.users.filter((user) => username === user.username);

  if (user.length === 1) {
    bcrypt.compare(password, user[0].password, function (err, result) {
      if (!result) {
        return res.status(401).json({message: "Invalid password"});
      }
      else {
        let loginData = {
          username,
          signInTime: Date.now()
        }

        const token = jwt.sign(loginData, jwtSecretKey);
        // res.send(user);
        res.status(200).json({message: "success", token});
      }
    });
  }
});

app.post('/verify', (req, res) => {
  const tokenHeaderKey = "jwt-token";
  const authToken = req.headers[tokenHeaderKey];
  try {
      const verified = jwt.verify(authToken, jwtSecretKey)
      if (verified) {
          return res.status(200).json({ status: "logged in", message: "success" });
      }
      else {
          return res.status(401).json({ status: "invalid auth", message: "error" });
      }
  }
  catch (error) {
      return res.status(401).json({ status: "invalid auth", message: "error" });
  }
});

app.post('/check-account', (req, res) => {
  const { username } = req.body;
  const user = data.users.filter((user) => username === user.username);

  res.status(200).json({
    status: user.length === 1 ? "User exists" : "User does not exists",
    userExists: user.length === 1,
    email: user.length === 1 ? user[0].email : ""
  });
});

app.post('/check-repeating-info', (req, res) => {
  const { email, username } = req.body;
  const user = data.users.filter((user) => username === user.username || email === user.email);

  res.status(200).json({
    status: user.length >= 1 ? "User exists" : "User does not exists",
    userExists: user.length >= 1,
  });
});





// CRUDing users
app.post("/create-account", (req, res) => {
  const { email, username, password } = req.body;
  const user = data.users.filter((user) => email === user.email || username === user.username);

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    console.log("Email format is incorrect");
    res.send({ message: "Email format is incorrect" });
    return;
  }
  if ('' === username || /[^a-z0-9]/.test(username)) {
    console.log("Username format is incorrect");
    res.send({ message: "Username format is incorrect" });
    return;
  }
  if ('' === password || /\s/.test(password) || password.length < 7) {
    console.log("password format is incorrect");
    res.send({ message: "password format is incorrect" });
    return;
  }

  if (user.length === 0) {
    bcrypt.hash(password, 10, function (err, hash) {
      let id = data.users.length === 0 ? 1 : parseInt(data.users[data.users.length - 1].id) + 1;
      const account = {
        id: id,
        email: email,
        username: username,
        password: hash
      };

      console.log(account);
      data.users.push(account);
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      let loginData = {
        email, 
        signInTime: Date.now()
      }

      const token = jwt.sign(loginData, jwtSecretKey);
      res.status(200).json({ message: "success", token })
    });
    return;
  }

  console.log("A user with the email " + email + " or the username " + username + " already exists");
  res.send({ message: "A user with the email " + email + " or the username " + username + " already exists" });
});



app.get('/read-email', (req, res) => {
  let user = data.users.filter((user) => Object.keys(req.body).includes('id') ? 
    user.id === req.body.id : 
    user.username === req.body.username)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.email);
  res.send({  email: user.email });
});
app.post('/read-email', (req, res) => {
  let user = data.users.filter((user) => Object.keys(req.body).includes('id') ? 
    user.id === req.body.id : 
    user.username === req.body.username)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.email);
  res.send({  email: user.email });
});


app.get('/read-user-id', (req, res) => {
  let user = data.users.filter((user) => Object.keys(req.body).includes('username') ? 
  user.username === req.body.username : 
  user.email === req.body.email)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.id);
  res.send({  id: user.id });
});
app.post('/read-user-id', (req, res) => {
  let user = data.users.filter((user) => Object.keys(req.body).includes('username') ? 
  user.username === req.body.username : 
  user.email === req.body.email)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.id);
  res.send({  id: user.id });
});


app.get('/read-username', (req, res) => {
  console.log(req.body);
  let user = data.users.filter((user) => Object.keys(req.body).includes('id') ? 
  user.id === req.body.id : 
  user.email === req.body.email)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.username);
  res.send({  username: user.username });
});
app.post('/read-username', (req, res) => {
  console.log(req.body);
  let user = data.users.filter((user) => Object.keys(req.body).includes('id') ? 
  user.id === req.body.id : 
  user.email === req.body.email)[0];

  if (!user) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
    return;
  }

  console.log(user.username);
  res.send({  username: user.username });
});



app.put('/update-email', (req, res) => {
  const { password, newEmail } = req.body;

  if (!newEmail) {
    console.log("New password cannot be empty");
    res.send({ message: "New password cannot be empty" });
    return;
  }

  if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(newEmail)) {
    console.log("Email format is incorrect");
    res.send({ message: "Email format is incorrect" });
    return;
  }

  const user = Object.keys(req.body).includes('id') ? 
    data.users.filter((user) => user.id === req.body.id)[0] : 
    (Object.keys(req.body).includes('username') ? 
      data.users.filter((user) => user.username === req.body.username)[0] :
      data.users.filter((user) => user.email === req.body.email)[0]);

  if (!user) {
    console.log("There is no acount with the given information");
    res.send({ message: "There is no account with the given information" });
    return;
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {
      const users = data.users.filter((user) => user.email === newEmail);

      if (users.length !== 0) {
        console.log("This email is already under use");
        res.send({ message: "This email is already under use" });
        return;
      }
      
      Object.keys(req.body).includes('id') ? 
        data.users.filter((user) => user.id === req.body.id)[0].email = newEmail : 
        (Object.keys(req.body).includes('username') ? 
          data.users.filter((user) => user.username === req.body.username)[0].email = newEmail :
          data.users.filter((user) => user.email === req.body.email)[0].email = newEmail);
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      console.log(data.users);
      res.status(200).json(data.users);
    }
  });
});

app.put('/update-username', (req, res) => {
  const { password, newUsername } = req.body;

  if (!newUsername) {
    console.log("New password cannot be empty");
    res.send({ message: "New password cannot be empty" });
    return;
  }

  if (/[^a-z0-9]/.test(newUsername)) {
    console.log("Username format is incorrect");
    res.send({ message: "Username format is incorrect" });
    return;
  }

  const user = Object.keys(req.body).includes('id') ? 
    data.users.filter((user) => user.id === req.body.id)[0] : 
    (Object.keys(req.body).includes('username') ? 
      data.users.filter((user) => user.username === req.body.username)[0] :
      data.users.filter((user) => user.email === req.body.email)[0]);

  if (!user) {
    console.log("There is no acount with the given information");
    res.send({ message: "There is no account with the given information" });
    return;
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {
      const users = data.users.filter((user) => user.username === newUsername);

      if (users.length !== 0) {
        console.log("This username is already under use");
        res.send({ message: "This username is already under use" });
        return;
      }
      
      Object.keys(req.body).includes('id') ? 
        data.users.filter((user) => user.id === req.body.id)[0].username = newUsername : 
        (Object.keys(req.body).includes('username') ? 
          data.users.filter((user) => user.username === req.body.username)[0].username = newUsername :
          data.users.filter((user) => user.email === req.body.email)[0].username = newUsername);
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      console.log(data.users);
      res.status(200).json(data.users);
    }
  });
});

app.put('/update-password', (req, res) => {
  const { password, newPassword } = req.body;

  if (password === newPassword) {
    console.log("New password cannot be previous password");
    res.send( { message: "New pasword cannot be previous password" });
    return;
  }

  if (!newPassword) {
    console.log("New password cannot be empty");
    res.send({ message: "New password cannot be empty" });
    return;
  }

  if (/\s/.test(newPassword) || newPassword.length < 7) {
    console.log("password format is incorrect");
    res.send({ message: "password format is incorrect" });
    return;
  }

  const user = Object.keys(req.body).includes('id') ? 
    data.users.filter((user) => user.id === req.body.id)[0] : 
    (Object.keys(req.body).includes('username') ? 
      data.users.filter((user) => user.username === req.body.username)[0] :
      data.users.filter((user) => user.email === req.body.email)[0]);

  if (!user) {
    console.log("There is no acount with the given information");
    res.send({ message: "There is no account with the given information" });
    return;
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {      
      bcrypt.hash(newPassword, 10, function (err, hash) {
        Object.keys(req.body).includes('id') ? 
          data.users.filter((user) => user.id === req.body.id)[0].password = hash: 
          (Object.keys(req.body).includes('username') ? 
            data.users.filter((user) => user.username === req.body.username)[0].password = hash :
            data.users.filter((user) => user.email === req.body.email)[0].password = hash);
        fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

        console.log(data.users);
        res.status(200).json(data.users);
      });
    }
  });
});



app.delete('/delete-user', (req, res) => {
  const { password } = req.body;

  const user = Object.keys(req.body).includes('id') ? 
    data.users.filter((user) => user.id === req.body.id)[0] : 
    (Object.keys(req.body).includes('username') ? 
      data.users.filter((user) => user.username === req.body.username)[0] :
      data.users.filter((user) => user.email === req.body.email)[0]);

  if (!user) {
    console.log("There is no acount with the given information");
    res.send({ message: "There is no account with the given information" });
    return;
  }

  bcrypt.compare(password, user.password, function (err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {      
      data.users = data.users.filter((loopUser) => loopUser.id !== user.id);
      data.members = data.members.filter((member) => member.userId !== user.id);
      let newGroups = [];
      for (let i = 0; i < data.groups.length; i++) {
        if (data.groups[i].individual && data.groups[i].members.includes(user.id)) {
          continue;
        }
        else if (data.groups[i].members.includes(user.id)) {
          data.groups[i].members = data.groups[i].members.filter((member) => member !== user.id);
          data.groups[i].admins = data.groups[i].admins.filter((admin) => admin !== user.id);

          if (data.groups[i].members.length === 0) {
            continue;
          }
          if (data.groups[i].admins.length === 0) {
            data.groups[i].admins.push(data.groups[i].members[0]);
          }
        }
        newGroups.push(data.groups[i]);
      }

      data.groups = newGroups;
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      console.log(data.users);
      console.log(data.groups);
      console.log(data.members);
      res.status(200).json({users: data.users, groups: data.groups, members: data.members });
    }
  });
});





// CRUDing groups
app.post('/create-group', (req, res) => {
  const { username, usernames, name, individual } = req.body;

  let id = data.groups.length === 0 ? 1 : parseInt(data.groups[data.groups.length - 1].id) + 1;
  let members = [];
  let admins = [];
  let groupInfo = {};
  
  if (individual) {
    let membersData = data.users.filter((user) => username === user.username || usernames[0] === user.username);
    for (let i = 0; i < membersData.length; i++) {
      admins.push(membersData[i].id);
      members.push(membersData[i].id);
      console.log({ userId: membersData[i].id, groupId: id });
      data.members.push({ userId: membersData[i].id, groupId: id });
    }

    groupInfo = {
      id: id,
      members: members,
      name: "",
      admins: admins,
      individual: individual
    };
  }
  else {
    if (name === "") {
      console.log("Name cannot be empty. Try again");
      res.send({ message: "Name cannot be empty.Try again" });
      return;
    }

    let membersData = data.users.filter((user) => username === user.username || usernames.includes(user.username));
    for (let i = 0; i < membersData.length; i++) {
      if (membersData[i].username === username) {
        admins.push(membersData[i].id);
      }
      members.push(membersData[i].id);
      console.log({ userId: membersData[i].id, groupId: id });
      data.members.push({ userId: membersData[i].id, groupId: id });
    }

    groupInfo = {
      id: id,
      members: members,
      name: name,
      admins: admins,
      individual: individual
    };
  }

  data.groups.push(groupInfo);
  fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

  console.log(groupInfo);
  res.send(groupInfo); 
});



app.get('/read-members', (req, res) => {
  const { id } = req.body;
  let chat = data.groups.filter((group) => id === group.id)[0];
  let members = [];

  if (!chat) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
  }

  let membersData = data.users.filter((user) => chat.members.includes(user.id));
  for (let i = 0; i < membersData.length; i++) {
    members.push(membersData[i].username);
  }

  console.log(members);
  res.send(members);
});
app.post('/read-members', (req, res) => {
  const { id } = req.body;
  let chat = data.groups.filter((group) => id === group.id)[0];
  let members = [];

  if (!chat) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
  }

  let membersData = data.users.filter((user) => chat.members.includes(user.id));
  for (let i = 0; i < membersData.length; i++) {
    members.push(membersData[i].username);
  }

  console.log(members);
  res.send(members);
});

app.get('/read-name', (req, res) => {
  const { userId, groupId } = req.body;
  let group = data.groups.filter((group) => groupId === group.id)[0];

  if (group.individual) {
    let otherUser = group.members.filter((member) => member !== userId);
    if (otherUser.length !== 1) {
      console.log("Error occured. Try again");
      res.send({ message: "Error occured. Try again" });
    }
    else {
      let user = data.users.filter((user) => otherUser[0] === user.id);
      console.log(user[0].username);
      res.send(user[0].username);
    }
  }
  else {
    console.log(group.name);
    res.send(group.name);
  }
});
app.post('/read-name', (req, res) => {
  const { userId, groupId } = req.body;
  let group = data.groups.filter((group) => groupId === group.id)[0];

  if (group.individual) {
    let otherUser = group.members.filter((member) => member !== userId);
    if (otherUser.length !== 1) {
      console.log("Error occured. Try again");
      res.send({ message: "Error occured. Try again" });
    }
    else {
      let user = data.users.filter((user) => otherUser[0] === user.id);
      console.log(user[0].username);
      res.send(user[0].username);
    }
  }
  else {
    console.log(group.name);
    res.send(group.name);
  }
});

app.get('/read-admins', (req, res) => {
  const { id } = req.body;
  let group = data.groups.filter((group) => id === group.id)[0];
  let admins = [];

  if (!group) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
  }

  let adminsData = data.users.filter((user) => group.admins.includes(user.id));
  for (let i = 0; i < adminsData.length; i++) {
    admins.push(adminsData[i].username);
  }

  console.log(admins);
  res.send(admins);
});
app.post('/read-admins', (req, res) => {
  const { id } = req.body;
  let group = data.groups.filter((group) => id === group.id)[0];
  let admins = [];

  if (!group) {
    console.log("There are no accounts with the given information");
    res.send({ message: "There are no accounts with the given information" });
  }

  let adminsData = data.users.filter((user) => group.admins.includes(user.id));
  for (let i = 0; i < adminsData.length; i++) {
    admins.push(adminsData[i].username);
  }

  console.log(admins);
  res.send(admins);
});

app.get('/read-group-id', (req, res) => {
  const { name } = req.body;
  let ids = [];

  let idsData = data.groups.filter((group) => group.name === name);
  if (idsData.length === 0) {
    console.log("Group named " + name + " does not exist or is an individual chat")
    res.send({ message: "Group named " + name + " does not exist or is an individual chat" });
    return;
  }
  for (let i = 0; i < idsData.length; i++) {
    ids.push(idsData[i].id);
  }

  console.log(ids);
  res.send(ids);
});
app.post('/read-group-id', (req, res) => {
  const { name } = req.body;
  let ids = [];

  let idsData = data.groups.filter((group) => group.name === name);
  if (idsData.length === 0) {
    console.log("Group named " + name + " does not exist or is an individual chat")
    res.send({ message: "Group named " + name + " does not exist or is an individual chat" });
    return;
  }
  for (let i = 0; i < idsData.length; i++) {
    ids.push(idsData[i].id);
  }

  console.log(ids);
  res.send(ids);
});


app.put('/join-group', (req, res) => {
  const { userId, groupId } = req.body;

  // let groupIndex = data.groups.findIndex((group) => groupId === group.id)

  if (data.groups.filter((group) => groupId === group.id)[0].members.includes(userId)) {
    console.log("User " + userId + " is already in that group");
    res.send({ message: "User " + userId + " is already in that group" });
    return;
  }
  if (data.groups.filter((group) => groupId === group.id)[0].individual) {
    console.log("Chat is individual, and therefore cannot join it");
    res.send({ message: "Chat is individual, and therefore cannot join it" });
    return;
  }

  for (let i = 0; i < data.groups.length; i++) {
    if (data.groups[i].id === groupId) {
      data.groups[i].members.push(userId);
      data.members.push({ userId: userId, groupId: groupId });
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));
      break;
    }
  }
  
  console.log(data.groups.filter((group) => groupId === group.id)[0]);
  console.log(data.members.filter((member) => userId === member.id));
  res.send({ 
    group: data.groups.filter((group) => groupId === group.id)[0], 
    userGroups: data.members.filter((member) => userId === member.id)
  });
});

app.put('/leave-group', (req, res) => {
  const { userId, groupId } = req.body;

  if (!data.groups.filter((group) => groupId === group.id)[0].members.includes(userId)) {
    console.log("User " + userId + " is not in that group");
    res.send({ message: "User " + userId + " is not in that group" });
    return;
  }
  if (data.groups.filter((group) => groupId === group.id)[0].individual) {
    console.log("Chat is individual, and therefore cannot leave it");
    res.send({ message: "Chat is individual, and therefore cannot leave it" });
    return;
  }

  for (let i = 0; i < data.groups.length; i++) {
    if (data.groups[i].id === groupId) {
      for (let j = 0; j < data.groups[i].members.length; j++) {
        if (data.groups[i].members[j] === userId) {
          data.groups[i].members.splice(j, 1);
          break;
        }
      }

      for (let j = 0; j < data.members.length; j++) {
        if (data.members[j].groupId === groupId && data.members[j].userId === userId) {
          data.members.splice(j, 1);
          break;
        }
      }

      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));
      console.log(data.groups[i]);
      console.log(data.members);
      res.send({ groupMembers: data.groups[i].members, members: data.members });
      return;
    }
  }
});

app.put('/update-name', (req, res) => {
  const { userId, groupId, newName } = req.body;

  if (!data.groups.filter((group) => groupId === group.id)[0].admins.includes(userId)) {
    console.log("User " + userId + " is not an admin of the group");
    res.send({ message: "User " + userId + " is not an admin of the group" });
    return;
  }
  if (data.groups.filter((group) => groupId === group.id)[0].individual) {
    console.log("Chat is individual, and therefore cannot change its name");
    res.send({ message: "Chat is individual, and therefore cannot change its name" });
    return;
  }

  data.groups.filter((group) => groupId === group.id)[0].name = newName;
  fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

  console.log(data.groups.filter((group) => groupId === group.id)[0]);
  res.send({ newName: newName });
});

app.put('/add-admin', (req, res) => {
  const { userId, otherUserId, groupId } = req.body;

  let groupIndex = data.groups.findIndex((group) => groupId === group.id);

  if (data.groups[groupIndex].admins.includes(otherUserId)) {
    console.log("User " + otherUserId + " is already an admin of this group");
    res.send({ message: "User " + otherUserId + " is already an admin of this group" });
    return;
  }
  if (!data.groups[groupIndex].admins.includes(userId)) {
    console.log("User " + userId + " is not an admin of the chat, and cannot promote members to admin status");
    res.send({ message: "User " + userId + " is not an admin of the chat, and cannot promote members to admin status" });
    return;
  }
  if (!data.groups[groupIndex].members.includes(otherUserId)) {
    console.log("User " + otherUserId + " is not a member of the chat");
    res.send({ message: "User " + otherUserId + " is not a member of the chat" });
    return;
  }

  data.groups[groupIndex].admins.push(otherUserId);
  fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

  console.log(data.groups[groupIndex].admins);
  res.send({ admins: data.groups[groupIndex].admins });
});

// app.put('/remove-admin', (req, res) => {
// });

app.delete('/delete-group', (req, res) => {
  const { userId, groupId } = req.body;

  if (!data.groups.filter((group) => groupId === group.id)[0].admins.includes(userId)) {
    console.log("User " + userId + " is not an admin of the group");
    res.send({ message: "User " + userId + " is not an admin of the group" });
    return;
  }

  for (let i = 0; i < data.groups.length; i++) {
    if (data.groups[i].id === groupId) {
      data.groups.splice(i, 1);
      break;
    }
  }

  fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));
  console.log(data.groups);
  res.send(data.groups);
  // ALSO DElETE ALL THE MESSAGES SENT IN THE CHAT
});





// CRUDing members
app.get('/read-users', (req, res) => {
  req.url = '/read-members';
  app._router.handle(req, res);
  return;
});
app.post('/read-users', (req, res) => {
  req.url = '/read-members';
  app._router.handle(req, res);
  return;
});

app.get('/read-groups', (req, res) => {
  const { id } = req.body;

  let groups = data.members.filter((member) => member.userId === id);
  for (let i = 0; i < groups.length; i++) {
    groups[i] = groups[i].groupId;
  }

  console.log(groups);
  res.send({ groups: groups });
});
app.post('/read-groups', (req, res) => {
  const { id } = req.body;

  let groups = data.members.filter((member) => member.userId === id);
  for (let i = 0; i < groups.length; i++) {
    groups[i] = groups[i].groupId;
  }

  console.log(groups);
  res.send({ groups: groups });
});





// CRUDing messages
app.post('/create-message', (req, res) => {
  const { userId, groupId, content } = req.body;

  if (data.users.filter((user) => user.id === userId).length !== 1) {
    console.log("userId is not valid");
    res.send({ message: "userId is not valid" });
    return;
  }
  let group = data.groups.filter((group) => group.id === groupId);
  if (group.length !== 1) {
    console.log("groupId is not valid");
    res.send({ message: "groupId is not valid" });
    return;
  }
  if (!group[0].members.includes(userId)) {
    console.log("user " + userId + " is not part of group " + groupId);
    res.send({ message: "user " + userId + " is not part of group " + groupId });
    return; 
  }
  if (!content) {
    console.log("content cannot be empty");
    res.send({ message: "content cannot be empty"});
    return;
  }

  let id = data.messages.length === 0 ? 1 : parseInt(data.messages[data.messages.length - 1].id) + 1;
  const message = {
    id: id,
    userId: userId,
    groupId: groupId,
    content: content,
    date: new Date()
  }

  data.messages.push(message);
  fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

  console.log(message);
  res.send(message);
});



app.get('/read-message-id', (req, res) => {
  const { userId, groupId, content } = req.body;

  let messages = data.messages.filter((message) => (userId ? userId === message.userId : true) && 
    (groupId ? groupId === message.groupId : true) && 
    (content ? message.content.toLowerCase().includes(content.toLowerCase()) : true));

  if (messages.length === 0) {
    console.log("No messages found with the given information");
    res.send( {message: "No messages found with the given information" });
    return;
  }
    
  console.log(messages);
  res.send({ messages: messages });
});
app.post('/read-message-id', (req, res) => {
  const { userId, groupId, content } = req.body;

  let messages = data.messages.filter((message) => (userId ? userId === message.userId : true) && 
    (groupId ? groupId === message.groupId : true) && 
    (content ? message.content.toLowerCase().includes(content.toLowerCase()) : true));

  if (messages.length === 0) {
    console.log("No messages found with the given information");
    res.send( {message: "No messages found with the given information" });
    return;
  }
    
  console.log(messages);
  res.send({ messages: messages });
});

app.get('/read-message-sender', (req, res) => {
  const { id } = req.body;

  let sender = data.messages.filter((message) => message.id === id);

  if (sender.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(sender[0].userId);
  res.send({ sender: sender[0].userId });
});
app.post('/read-message-sender', (req, res) => {
  const { id } = req.body;

  let sender = data.messages.filter((message) => message.id === id);

  if (sender.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(sender[0].userId);
  res.send({ sender: sender[0].userId });
});

app.get('/read-message-group-origin', (req, res) => {
  const { id } = req.body;

  let group = data.messages.filter((message) => message.id === id);

  if (group.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(group[0].groupId);
  res.send({ group: group[0].groupId });
});
app.post('/read-message-group-origin', (req, res) => {
  const { id } = req.body;

  let group = data.messages.filter((message) => message.id === id);

  if (group.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(group[0].groupId);
  res.send({ group: group[0].groupId });
});

app.get('/read-message-content', (req, res) => {
  const { id } = req.body;

  let content = data.messages.filter((message) => message.id === id);

  if (content.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(content[0].content);
  res.send({ group: content[0].content });
});
app.post('/read-message-content', (req, res) => {
  const { id } = req.body;

  let content = data.messages.filter((message) => message.id === id);

  if (content.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(content[0].content);
  res.send({ group: content[0].content });
});

app.get('/read-message-date-sent', (req, res) => {
  const { id } = req.body;

  let dateSent = data.messages.filter((message) => message.id === id);

  if (dateSent.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(dateSent[0].date);
  res.send({ group: dateSent[0].date });
});
app.post('/read-message-date-sent', (req, res) => {
  const { id } = req.body;

  let dateSent = data.messages.filter((message) => message.id === id);

  if (dateSent.length === 0) {
    console.log("No message with id " + id);
    res.send({ message: "No message with id " + id });
    return;
  }

  console.log(dateSent[0].date);
  res.send({ group: dateSent[0].date });
});

app.get('/read-user-messages', (req, res) => {
  req.body.userId = req.body.id;
  req.url = '/read-message-id';
  app._router.handle(req, res);
  return;
});
app.post('/read-user-messages', (req, res) => {
  req.body.userId = req.body.id;
  req.url = '/read-message-id';
  app._router.handle(req, res);
  return;
});

app.get('/read-chat-messages', (req, res) => {
  req.body.groupId = req.body.id;
  req.url = '/read-message-id';
  app._router.handle(req, res);
  return;
});
app.post('/read-chat-messages', (req, res) => {
  req.body.groupId = req.body.id;
  req.url = '/read-message-id';
  app._router.handle(req, res);
  return;
});



app.put('/update-message-content',(req, res) => {
  const { messageId, userId, password, newContent } = req.body;

  // let message = data.messages.filter((message) => messageId === message.id);
  let messageIndex = data.messages.findIndex((message) => messageId === message.id);

  if (messageIndex === -1) {
    console.log("There is no message with id " + messageId);
    res.send({ message: "There is no message with id " + messageId });
    return;
  }
  if (data.messages[messageIndex].userId !== userId) {
    console.log("The user " + userId + " did not create this message");
    res.send({ message: "The user " + userId + " did not create this message" });
    return;
  }

  // let user = data.users.filter((user) => userId === user.id);
  let userIndex = data.users.findIndex((user) => userId === user.id);
  if (userIndex === -1) {
    console.log("This is no account with id " + userId);
    res.send({ message: "There is no account with id " + userId });
    return;
  }
  if (!newContent) {
    console.log("Edited message cannot be empty");
    res.send({ message: "Edited message cannot be empty" });
    return;
  }
  
  bcrypt.compare(password, data.users[userIndex].password, function(err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {
      // data.messages.filter((message) => messageId === message.id)[0].content = newContent;
      // data.messages.filter((message) => messageId === message.id)[0].date = new Date();

      data.messages[messageIndex].content = newContent;
      data.messages[messageIndex].date = new Date();

      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      console.log(data.messages[messageIndex]);
      res.send({ message: data.messages[messageIndex] });
    }
  });
});



app.delete('/delete-message', (req, res) => {
  const { messageId, userId, password } = req.body;
  let messageIndex = data.messages.findIndex((message) => message.id === messageId);

  if (messageIndex === -1) {
    console.log("There is no message with id " + messageId);
    res.send({ message: "There is no message with id " + messageId });
    return;
  }
  if (data.messages[messageIndex].userId !== userId) {
    console.log("The user " + userId + " did not create this message");
    res.send({ message: "The user " + userId + " did not create this message" });
    return;
  }

  let userIndex = data.users.findIndex((user) => userId === user.id);
  if (userIndex === -1) {
    console.log("This is no account with id " + userId);
    res.send({ message: "There is no account with id " + userId });
    return;
  }

  bcrypt.compare(password, data.users[userIndex].password, function(err, result) {
    if (!result) {
      console.log("Invalid password");
      return res.status(401).json({message: "Invalid password"});
    }
    else {
      data.messages.splice(messageIndex, 1);
      fs.writeFileSync("./server/db.json", JSON.stringify(data, null, 4));

      console.log(data.messages);
      res.send({ messages: data.messages });
    }
  });
});





// app.get('/test-1', test1);

// app.get('/test-2', test2);

// function test1(req, res) {
//   const { username1, username2 } = req.body;

//   req.url = "/test-2";
//   app._router.handle(req, res);
//   console.log(username2);
//   // res.write(username2);
//   // res.end();
// }

// function test2(req, res) {
//   const { username1, username2 } = req.body;
//   console.log(username1);
//   res.write(username1);
//   res.end();
//   // return;
// }



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
