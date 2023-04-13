import React from 'react';
import { useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';
import Button from './Button';
import dogPic from '../dog.jpg';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  DialogTitle
} from '@mui/material'

const Dashboard = ({ token }) => {
  const [gameModal, setGameModal] = React.useState(false);
  checkToken('/dashboard', true);
  console.log(token)

  const navigate = useNavigate();
  async function logout () {
    const response = await fetch('http://localhost:5005/admin/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `${localStorage.getItem('token')}`
      }
    });
    const data = await response.json();
    console.log(data);
    localStorage.removeItem('token');
    navigate('/');
  }

  const handleOpenModal = () => {
    setGameModal(true);
  };

  const handleCloseModal = () => {
    setGameModal(false);
  };

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Box sx={{ display: 'flex' }}>
          <Typography variant="h1" sx={{ fontSize: '3rem', color: '#00695c', marginLeft: '1rem', marginTop: '1rem' }}> BigBrain</Typography>
          <PsychologyOutlinedIcon sx={{ fontSize: 80, color: '#00695c', marginBottom: '1rem' }} />
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Button onClick={handleOpenModal}>Create New Game</Button>
          <Dialog open={gameModal} onClose={handleCloseModal}>
            <DialogTitle sx={{ fontWeight: 'bold' }}>Create a New Game</DialogTitle>
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
                type="text"
                fullWidth
                variant="standard"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseModal}>Cancel</Button>
              <Button onClick={handleCloseModal}>Add Game</Button>
            </DialogActions>
          </Dialog>
          <Button onClick={logout}>Logout</Button>
        </Box>
      </Box>
      <Box>
        <Card sx={{ maxWidth: 345 }}>
          <CardMedia
            component="img"
            alt="dog"
            height="140"
            image={dogPic}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">Title</Typography>
            <Typography variant="body2" color="text.secondary">Time</Typography>
          </CardContent>
          <CardActions sx={{ padding: '1rem' }}>
            <Button sx={{ bgcolor: '#66bb6a', color: 'white' }}>Start Game</Button>
            <Button sx={{ bgcolor: '#fb8c00', color: 'white' }}>Edit Game</Button>
            <Button sx={{ bgcolor: '#ef5350', color: 'white' }}>Delete Game</Button>
          </CardActions>
        </Card>
      </Box>
    </>
  )
}

export default Dashboard;
