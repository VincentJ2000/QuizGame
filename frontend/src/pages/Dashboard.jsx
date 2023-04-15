import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  DialogTitle,
  AppBar
} from '@mui/material'

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [gameModal, setGameModal] = useState(false);
  const [newGame, setNewGame] = useState('');

  const fetchAllQuizzes = async () => {
    const response = await fetch('http://localhost:5005/admin/quiz/', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await response.json();
    console.log(data);
    setQuizList(data.quizzes);
  }

  useEffect(async () => {
    await fetchAllQuizzes();
  }, [gameModal]);

  const startQuiz = (quizID) => {
  };

  const editQuiz = (quizID) => {
    navigate('/edit/' + quizID);
  };

  const deleteQuiz = async (quizID) => {
    await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    await fetchAllQuizzes();
  };

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
    await fetchAllQuizzes();
    handleCloseModal();
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
                <Button onClick={logout}>Logout</Button>
              </Box>
          </Box>
      </AppBar>
      <Grid container spacing={5} alignItems="flex-end" justifyContent="center" sx={{ padding: '1rem' }}>
        {quizList.map((quiz, index) => (
          <Grid
            item
            key={index}
            xs={12}
            sm={6}
            md={4}
          >
            <Card sx={{ maxWidth: 345 }}>
              <CardMedia
                component="img"
                alt="img"
                height="140"
                image={quiz.thumbnail}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">{quiz.name}</Typography>
                <Typography variant="body2" color="text.secondary">Time</Typography>
              </CardContent>
              <CardActions sx={{ padding: '1rem' }}>
                <Button sx={{ bgcolor: '#66bb6a', color: 'white' }} onClick={() => startQuiz(quiz.id)}>Start Quiz</Button>
                <Button sx={{ bgcolor: '#fb8c00', color: 'white' }} onClick={() => editQuiz(quiz.id)}>Edit Quiz</Button>
                <Button sx={{ bgcolor: '#ef5350', color: 'white' }} onClick={() => deleteQuiz(quiz.id)}>Delete Quiz</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default Dashboard;
