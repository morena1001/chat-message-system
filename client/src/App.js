import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './components/home/home';
import { Login } from './components/login/login';
import { Register } from './components/Register/register';

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' exact Component={Home} />
          <Route path='/login' Component={Login} />
          <Route path='/register' Component={Register} />
          {/* <Route path='/shows/:id' Component={Resource} />
          <Route path='/new' Component={CreateResource} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
