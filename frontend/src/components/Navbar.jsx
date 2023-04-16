import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
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

const Navbar = ({ setQuizList }) => {
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState(false);
  const [newGame, setNewGame] = useState('');

  async function logout () {
    await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
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
    await fetch('http://localhost:5005/admin/quiz/new', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        name: newGame
      }),
    });
    setNewGame('');
    handleCloseModal();
    // Change quizList state to invoke useEffect to fetchAllQuizzes
    if (setQuizList) {
      setQuizList([]);
    }
  };

  const toDashboard = () => {
    navigate('/dashboard');
  }

  return (
    <>
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#00695c', marginBottom: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex' }} onClick={toDashboard}>
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
