import React from 'react';
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import EditQuiz from './pages/EditQuiz';
import EditQuestion from './pages/EditQuestion';
import GameScreen from './pages/GameScreen';
import AdminScreen from './pages/AdminScreen';
import Game from './pages/Game';
import GamePlay from './pages/GamePlay';

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
          <Route path="/edit" element={<EditQuiz />} />
          <Route path="/editQuestion" element={<EditQuestion />} />
          <Route path="/game" element={<Game />} />
          <Route path="/game/:sessionid" element={<GameScreen />} />
          <Route path="/game/:sessionid/:playerid/play" element={<GamePlay/>} />
          <Route path="/game/admin/:sessionid/:quizid" element={<AdminScreen />} />
          {/* <Route path="/profile/:name" element={<Profile />} /> */}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
