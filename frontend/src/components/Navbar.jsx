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
  AppBar,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = ({ fetchState, setFetchState }) => {
  const navigate = useNavigate();
  const [gameModal, setGameModal] = useState(false);
  const [newGame, setNewGame] = useState('');
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
    setNewGame('');
    handleCloseModal();
    // fetchAllQuizzes
    if (setFetchState) {
      setFetchState(!fetchState);
    }
  };

  const toDashboard = () => {
    navigate('/dashboard');
  };

  const joinGame = () => {
    navigate('/game');
  };

  return (
    <>
        <AppBar position="static" elevation={0} sx={{ bgcolor: '#00695c', marginBottom: '1rem' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }} onClick={toDashboard}>
                    <Typography variant="h1" sx={{ fontSize: { xs: '1.5rem', md: '3rem' }, color: 'white', marginLeft: '1rem' }}> BigBrain</Typography>
                    <PsychologyOutlinedIcon sx={{ fontSize: { xs: 40, md: 80 }, color: 'white' }} />
                </Box>
                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                  <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="menu-appbar"
                    aria-haspopup="true"
                    onClick={handleOpenNavMenu}
                    color="inherit"
                  >
                    <MenuIcon />
                  </IconButton>
                  <Menu
                    id="menu-appbar"
                    anchorEl={anchorElNav}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'left',
                    }}
                    keepMounted
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    open={Boolean(anchorElNav)}
                    onClose={handleCloseNavMenu}
                    sx={{
                      display: { xs: 'block', md: 'none' },
                    }}
                  >
                    <MenuItem onClick={() => { handleCloseNavMenu(); handleOpenModal(); }}>
                      <Typography textAlign="center">Create New Quiz</Typography>
                    </MenuItem>
                    <MenuItem onClick={() => { handleCloseNavMenu(); joinGame(); }}>
                        <Typography textAlign="center">Join Game</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => { handleCloseNavMenu(); logout(); }}>
                        <Typography textAlign="center">Logout</Typography>
                      </MenuItem>
                  </Menu>
                </Box>
                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                  <Button onClick={handleOpenModal}>Create New Quiz</Button>
                  <Button onClick={joinGame}>Join Game</Button>
                  <Button onClick={logout}>Logout</Button>
                </Box>
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
            </Box>
        </AppBar>
    </>
  )
}

export default Navbar;
