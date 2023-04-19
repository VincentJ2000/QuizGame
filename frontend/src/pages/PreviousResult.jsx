import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import {
  Typography,
  Container,
  Box,
} from '@mui/material'

const PreviousResult = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizID = params.quizID;
  const sessionID = params.sessionID;
  const props = useLocation();
  const quizDetails = props.state.quiz;
  const prevSession = props.state.session;
  const quizTime = props.state.time;

  useEffect(() => {
    console.log(prevSession.results);
  }, []);

  return (
        <>
            <Navbar />
            <Container
                maxWidth="md"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                }}
            >
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button size="0.9rem" bgcolor="skyblue" onClick={() => { navigate(`/previousSession/${quizID}`) }}>Previous sessions</Button>
              <Typography variant="h4" component="div" align="center">Session {sessionID} of {quizDetails.name} quiz</Typography>
            </Box>
            <Box sx={{
              borderRadius: '10px',
              color: 'black',
              bgcolor: 'white',
              fontSize: '40px',
              width: '80vw',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly'
            }}>
              <Typography sx={{ paddingBottom: '1rem' }} variant="h5" component="div" align="center">Quiz time: {quizTime}</Typography>
              {prevSession.results.map((user, index) => (
                <Box key={index} sx={{ paddingBottom: '1rem' }}>
                  <Typography variant="h5" component="div" align="center">Player {index + 1}: {user.name}</Typography>
                  {user.answers.map((answer, index) => (
                    <Typography key={index} component="div" align="center">Question {index + 1}: {answer.correct ? 'correct' : 'incorrect'}</Typography>
                  ))}
                </Box>
              ))}
              </Box>
            </Container>
        </>
  )
};

export default PreviousResult;
