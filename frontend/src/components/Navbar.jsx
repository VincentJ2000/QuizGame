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
  const [gameFile, setGameFile] = useState('');
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenModal = () => {
    setGameModal(true);
  };

  const handleCloseModal = () => {
    setGameModal(false);
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

  const handleJSONfile = (e) => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = (event) => {
      // Check if file is JSON
      let isJSON = true;
      try {
        const file = JSON.parse(event.target.result);
        console.log('file', file);
        setGameFile(file);
      } catch {
        isJSON = false;
        setGameFile('');
      }
      // Show error message
      if (!isJSON) {
        alert('File is not a JSON file, upload the correct format file');
      }
    };
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
                <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'space-around' }}>
                  <Button onClick={handleOpenModal}>Create New Quiz</Button>
                  <Button onClick={joinGame}>Join Game</Button>
                  <Button bgcolor='skyblue' onClick={logout}>Logout</Button>
                </Box>
                <Dialog open={gameModal} onClose={handleCloseModal}>
                    <DialogTitle sx={{ fontWeight: 'bold' }}>Create a New Quiz</DialogTitle>
                    <DialogContent>
                      <DialogContentText>
                          Please enter the name of the new game you want to add, or upload a JSON quiz file.
                      </DialogContentText>
                      <TextField
                          autoFocus
                          required
                          margin="dense"
                          id="name"
                          label={(gameFile !== '' ? 'JSON file provided is valid' : 'Game Name')}
                          value={newGame}
                          onChange={(e) => setNewGame(e.target.value)}
                          type="text"
                        Width
                          variant="standard"
                          disabled={gameFile !== ''}
                      />
                      <Typography sx={{ marginTop: '1rem' }}>Upload JSON File</Typography>
                      <input
                        type="file"
                        name="attachment"
                        id="attachment"
                        onChange={handleJSONfile}
                        disabled={newGame !== ''}
                      />
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                      <Button bgcolor='#ef5350' color='white' onClick={handleCloseModal}>Cancel</Button>
                      <Button onClick={addQuiz}>Add Quiz</Button>
                    </DialogActions>
                  </Dialog>
            </Box>
        </AppBar>
    </>
  )
}

export default Navbar;
