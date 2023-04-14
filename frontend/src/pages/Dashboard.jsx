import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import apiCall from './API';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography
} from '@mui/material'

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);
  const [quiz, setQuiz] = useState({});
  const [errorMessage, setErrorMessage] = React.useState(null);

  useEffect(() => {
    apiCall('admin/quiz', 'GET', {}, '')
      .then((data) => {
        console.log(data);
        setQuizList(data.quizzes);
      })
  }, []);

  // startQuiz popup
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  // start quiz
  async function startQuiz (quizID) {
    console.log(quizID)
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}/start`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      getQuiz(quizID);
      handleClickOpen();
    }
  }
  // get quiz
  async function getQuiz (quizID) {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      console.log(data)
      setQuiz(data);
    }
  }
  // copy link
  const copyLink = (sessionId) => {
    console.log(sessionId)
    const url = `http://localhost:3000/game/${sessionId}`;
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('Link copied to clipboard!');
      })
  }
  // stop quiz

  const [open2, setOpen2] = React.useState(false);
  const handleClickOpen2 = () => {
    setOpen2(true);
  };
  const handleClose2 = () => {
    setOpen2(false);
  };
  async function stopQuiz (quizID) {
    getQuiz(quizID);
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}/end`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
    } else {
      // prompt a modal to go to results page
      handleClickOpen2();
    }
  }
  const editQuiz = (quizID) => {
    navigate('/edit', { id: quizID });
  };

  const deleteQuiz = (quizID) => {
  };

  return (
    <>
      <Navbar></Navbar>
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#00695c',
            textAlign: 'center',
            borderRadius: '20px'
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '40px', color: 'white' }}>Session ID</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ textAlign: 'center', fontSize: '30px', color: 'white' }}>
            {quiz.active}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => copyLink(quiz.active)} full='true' >Copy Link</Button>
          <Button onClick={handleClose} full='true' >Close</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        fullWidth
        maxWidth='xs'
        open={open2}
        onClose={handleClose2}
        PaperProps={{
          style: {
            backgroundColor: '#00695c',
            textAlign: 'center',
            borderRadius: '20px'
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontSize: '20px', color: 'white' }}>Would you like to view the results?</DialogTitle>
        <DialogActions>
          <Button onClick={() => navigate(`/game/result/${quiz.active}`) } full='true' >Yes</Button>
          <Button onClick={handleClose2} full='true' >No</Button>
        </DialogActions>
      </Dialog>
      {errorMessage && (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
      )}
      <Grid container spacing={5} alignItems="flex-end">
        {quizList.map((quiz) => (
          <Grid
            item
            key={quiz.id}
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
                <Button sx={{ bgcolor: 'purple', color: 'white' }} onClick={() => stopQuiz(quiz.id)}>Stop Quiz</Button>
                <Button sx={{ bgcolor: '#fb8c00', color: 'white' }} onClick={() => editQuiz(quiz.id)}>Edit Quiz</Button>
                <Button sx={{ bgcolor: '#ef5350', color: 'white' }} onClick={() => deleteQuiz(quiz.id)}>Delete Quiz</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* <Box>
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
            <Button sx={{ bgcolor: '#66bb6a', color: 'white' }} onClick={startQuiz(quizID)}>Start Quiz</Button>
            <Button sx={{ bgcolor: '#fb8c00', color: 'white' }} onClick={editQuiz(quizID)}>Edit Quiz</Button>
            <Button sx={{ bgcolor: '#ef5350', color: 'white' }} onClick={deleteQuiz(quizID)}>Delete Quiz</Button>
          </CardActions>
        </Card>
      </Box> */}
    </>
  )
}

export default Dashboard;
