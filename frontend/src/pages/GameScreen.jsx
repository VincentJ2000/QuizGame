import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';
import { Box, Typography, TextField } from '@mui/material';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import Button from '../components/Button';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const GameScreen = () => {
  const navigate = useNavigate();
  const sessionId = useParams().sessionid;

  checkToken(`/game/${sessionId}`, true);
  const [name, setName] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(null);

  async function joinGame () {
    const response = await fetch(`http://localhost:5005/play/join/${sessionId}`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        name,
      }),
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      navigate(`/game/${sessionId}/${data.playerId}/play`)
    }
  }

  return (
    <Box sx={{
      backgroundColor: '#00695c',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      {errorMessage && (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
      )}
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
            label="Name"
            value={name}
            sx={{ backgroundColor: 'white', width: '270px', borderRadius: '10px', marginBottom: '20px' }}
            onChange={(e) => setName(e.target.value)}
        />
        <Button onClick={joinGame}>JOIN GAME</Button>
        <Button bgcolor="white" onClick={() => { navigate('/dashboard') }}>DASHBOARD</Button>
        <Button bgcolor="lightblue" onClick={() => { navigate('/game') }}>BACK</Button>
      </Box>
    </Box>
  );
};

export default GameScreen;
