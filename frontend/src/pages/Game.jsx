import React from 'react';
import Button from '../components/Button'
import { Box, Typography } from '@mui/material'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';
// import { teal } from '@mui/material/colors';
import TextField from '@mui/material/TextField';

const Game = () => {
  const navigate = useNavigate();
  checkToken('/game', true);
  const [sessionid, setSessionid] = React.useState('');
  console.log(sessionid)
  return (
    <Box sx={{
      backgroundColor: '#00695c',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <Box sx={{ marginTop: '2rem' }}>
        <PsychologyOutlinedIcon sx={{ fontSize: 230, color: 'white', marginTop: '5rem' }} />
      </Box>
      <Typography
        variant="h1"
        sx={{ fontSize: '3rem', color: 'white', marginBottom: '2rem' }}
      >
        BigBrain
      </Typography>
      <Box sx={{
        // backgroundColor: 'white',
        height: '250px',
        width: '400px',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        borderRadius: '10px',
      }}>
        <TextField
            variant="outlined"
            margin="normal"
            label="Session Id"
            value={sessionid}
            sx={{ backgroundColor: 'white', width: '270px', borderRadius: '10px', marginBottom: '20px' }}
            onChange={(e) => setSessionid(e.target.value)}
        />
        <Button onClick={() => { navigate(`/game/${sessionid}`) }}>JOIN GAME</Button>
        <Button bgcolor="white" onClick={() => { navigate('/dashboard') }}>DASHBOARD</Button>
      </Box>
    </Box>
  );
};

export default Game;
