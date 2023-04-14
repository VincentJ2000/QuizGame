import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import apiCall from './API';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
} from '@mui/material'

const Dashboard = ({ token }) => {
  const navigate = useNavigate();
  const [quizList, setQuizList] = useState([]);

  useEffect(() => {
    apiCall('admin/quiz', 'GET', {}, '')
      .then((data) => {
        console.log(data);
        setQuizList(data.quizzes);
      })
  }, []);

  const startQuiz = (quizID) => {
  };

  const editQuiz = (quizID) => {
    navigate('/edit', { id: quizID });
  };

  const deleteQuiz = (quizID) => {
  };

  return (
    <>
      <Navbar></Navbar>
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
