import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import apiCall from '../pages/API';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import {
  Box,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  DialogTitle,
  AppBar
} from '@mui/material'

const Navbar = () => {
  const [gameModal, setGameModal] = useState(false);
  const [newGame, setNewGame] = useState('');

  const navigate = useNavigate();
  async function logout () {
    apiCall('admin/auth/logout', 'POST')
      .then((data) => {
        console.log(data);
      });
    localStorage.removeItem('token');
    navigate('/');
  }

  const handleOpenModal = () => {
    setGameModal(true);
  };

  const handleCloseModal = () => {
    setGameModal(false);
  };

  const addQuiz = async () => {
    apiCall('admin/quiz/new', 'POST', { name: newGame })
      .then((data) => {
        console.log(data);
      });

    handleCloseModal();
    window.location.reload();
  };

  return (
    <>
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#00695c', marginBottom: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex' }}>
                    <Typography variant="h1" sx={{ fontSize: '3rem', color: 'white', marginLeft: '1rem', marginTop: '1rem' }}> BigBrain</Typography>
                    <PsychologyOutlinedIcon sx={{ fontSize: 80, color: 'white', marginBottom: '1rem' }} />
                  </Box>
                  <Box sx={{ display: 'flex' }}>
                    <Button onClick={handleOpenModal}>Create New Quiz</Button>
                    <Dialog open={gameModal} onClose={handleCloseModal}>
                      <DialogTitle sx={{ fontWeight: 'bold' }}>Create a New Quiz</DialogTitle>
                      <DialogContent>
                        <DialogContentText>
                            Please enter the name of the new game you want to add.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="name"
                            label="Game Name"
                            value={newGame}
                            onChange={(e) => setNewGame(e.target.value)}
                            type="text"
                            fullWidth
                            variant="standard"
                        />
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={handleCloseModal}>Cancel</Button>
                        <Button onClick={addQuiz}>Add Quiz</Button>
                      </DialogActions>
                    </Dialog>
                    <Button onClick={() => { navigate('/game') }}>Join Game</Button>
                    <Button onClick={logout}>Logout</Button>
                </Box>
            </Box>
        </AppBar>
    </>
  )
}

export default Navbar;
