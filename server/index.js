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

app.post("/create-account", (req, res) => {
  const { email, username, password } = req.body;
  const user = data.users.filter((user) => email === user.email);

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
      fs.writeFileSync("./server/db.json", JSON.stringify(data));

      let loginData = {
        email, 
        signInTime: Date.now()
      }

      const token = jwt.sign(loginData, jwtSecretKey);
      res.status(200).json({ message: "success", token })
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
      if (membersData[i].username === username) {
        admins.push(membersData[i].id);
      }
      members.push(membersData[i].id);
      console.log({ userId: membersData[i].id, groupId: id })
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
    let membersData = data.users.filter((user) => username === user.username || usernames.includes(user.username));
    for (let i = 0; i < membersData.length; i++) {
      if (membersData[i].username === username) {
        admins.push(membersData[i].id);
      }
      members.push(membersData[i].id);
      console.log({ userId: membersData[i].id, groupId: id })
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
  fs.writeFileSync("./server/db.json", JSON.stringify(data));

  console.log(groupInfo);
  res.send(groupInfo); 
});



app.get('/read-members', (req, res) => {
  const { id } = req.body;
  let chat = data.groups.filter((group) => id === group.id)[0];
  let members = [];

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

app.get('/read-admins', (req, res) => {
  const { id } = req.body;
  let group = data.groups.filter((group) => id === group.id)[0];
  let admins = [];

  let adminsData = data.users.filter((user) => group.admins.includes(user.id));
  for (let i = 0; i < adminsData.length; i++) {
    admins.push(adminsData[i].username);
  }

  console.log(admins);
  res.send(admins);
});

app.get('/read-id', (req, res) => {
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
      fs.writeFileSync("./server/db.json", JSON.stringify(data));
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

      fs.writeFileSync("./server/db.json", JSON.stringify(data));
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
  fs.writeFileSync("./server/db.json", JSON.stringify(data));

  console.log(data.groups.filter((group) => groupId === group.id)[0]);
  res.send({ newName: newName });
});

app.put('/add-admin', (req, res) => {
  const { userId, otherUserId, groupId } = req.body;

  if (data.groups.filter((group) => groupId === group.id)[0].admins.includes(otherUserId)) {
    console.log("User " + otherUserId + " is already an admin of this group");
    res.send({ message: "User " + otherUserId + " is already an admin of this group" });
    return;
  }
  if (!data.groups.filter((group) => groupId === group.id)[0].admins.includes(userId)) {
    console.log("User " + userId + " is not an admin of the chat, and cannot promote members to admin status");
    res.send({ message: "User " + userId + " is not an admin of the chat, and cannot promote members to admin status" });
    return;
  }
  if (!data.groups.filter((group) => groupId === group.id)[0].members.includes(otherUserId)) {
    console.log("User " + otherUserId + " is not a member of the chat");
    res.send({ message: "User " + otherUserId + " is not a member of the chat" });
    return;
  }

  data.groups.filter((group) => groupId === group.id)[0].admins.push(otherUserId);
  fs.writeFileSync("./server/db.json", JSON.stringify(data));

  console.log(data.groups.filter((group) => groupId === group.id)[0].admins);
  res.send({ admins: data.groups.filter((group) => groupId === group.id)[0].admins });
});

// app.put('/remove-admin', (req, res) => {
// });

app.delete('/delete-group', (req, res) => {

});





app.get('/test-1', test1);

app.get('/test-2', test2);

function test1(req, res) {
  const { username1, username2 } = req.body;

  req.url = "/test-2";
  app._router.handle(req, res);
  console.log(username2);
  // res.write(username2);
  // res.end();
}

function test2(req, res) {
  const { username1, username2 } = req.body;
  console.log(username1);
  res.write(username1);
  res.end();
  // return;
}



app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
