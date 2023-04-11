import React from 'react';
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import {
  BrowserRouter,
  Routes,
  Route
  // Link,
  // useParams,
  // useNavigate,
} from 'react-router-dom';
// import Button from './components/Button'
// import { Box, Typography } from '@mui/material'
// import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';

function App () {
  const [token, setToken] = React.useState(null);

  function manageTokenSet (token) {
    setToken(token);
    localStorage.setItem('token', token);
  }
  React.useEffect(() => {
    if (localStorage.getItem('token')) {
      setToken(localStorage.getItem('token'));
    }
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard token={token} />} />
          <Route path="/register" element={<Register onSuccess={manageTokenSet} />} />
          <Route path="/login" element={<Login onSuccess={manageTokenSet} />} />
          {/* <Route path="/profile/:name" element={<Profile />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
