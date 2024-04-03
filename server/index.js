var data = require('./db.json');

const path = require('path');
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

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



// Creating, joining, deleting groups
app.post('/create-group', (req, res) => {
  const { username, usernames, name } = req.body;

  let id = data.groups.length === 0 ? 1 : parseInt(data.groups[data.groups.length - 1].id) + 1;
  let members = [];
  
  let membersData = data.users.filter((user) => username === user.username || usernames.includes(user.username));
  for (let i = 0; i < membersData.length; i++) {
    members.push(membersData[i].id);
    console.log({ userId: membersData[i].id, groupId: id })
    data.members.push({ userId: membersData[i].id, groupId: id });
  }

  const groupInfo = {
    id: id,
    members: members,
    name: name
  };

  data.groups.push(groupInfo);
  fs.writeFileSync("./server/db.json", JSON.stringify(data));

  console.log(groupInfo);
  res.send(groupInfo);
});

app.post('/join-group', (req, res) => {
  const { username } = req.body;
  // const otherUser
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
