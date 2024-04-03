import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/Register/register';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.token) {
      setLoggedIn(false);
      return;
    }

    fetch("/verify", {
      method: "POST",
      headers: {
        "jwt-token": user.token
      }
    })
    .then(r => r.json())
    .then(r => {
      setLoggedIn('success' === r.message);
      setUsername(user.username || "");
    });
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={ <Home username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} /> } />
          <Route path='/login' element={ <Login username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUsername={username} /> } />
          <Route path='/register' element={ <Register username={username} loggedIn={loggedIn} setLoggedIn={setLoggedIn} setUsername={username} /> } />
          {/* <Route path='/shows/:id' Component={Resource} />
          <Route path='/new' Component={CreateResource} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
