import React from 'react';
import Button from '../components/Button'
import { Box, Typography } from '@mui/material'
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';

const Home = () => {
  const navigate = useNavigate();
  checkToken('/dashboard');
  return (
    <Box sx={{
      backgroundColor: '#00695c',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }}>
      <Box>
        <PsychologyOutlinedIcon sx={{ fontSize: 300, color: 'white', marginBottom: '1rem' }} />
      </Box>
      <Typography
        variant="h1"
        sx={{ fontSize: '6rem', color: 'white', marginBottom: '2rem' }}
      >
        BigBrain
      </Typography>
      <Box>
        <Button onClick={() => { navigate('/register'); }}>Register</Button>
        <Button onClick={() => { navigate('/login'); }}>Login</Button>
      </Box>
    </Box>
  );
};

export default Home;
