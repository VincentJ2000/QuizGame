import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/Button';
import Navbar from '../components/Navbar';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Container,
  Box
} from '@mui/material'

const PreviousSession = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizID = params.quizID;

  const [quizDetails, setQuizDetails] = useState([]);
  const [quizTime, setQuizTime] = useState('0');
  const [questionCount, setQuestionCount] = useState(0);
  const [allSessionIDs, setAllSessionIDs] = useState([]);
  const [prevSession, setPrevSession] = useState([]);

  // Get session results for every sessionID from oldSession
  async function getResult (sessionId) {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/results`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    setPrevSession(prevSession => [...prevSession, data]);
  }

  // Get oldSession from GET quizID
  const fetchQuiz = async () => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await response.json();
    console.log('data', data);
    console.log('oldSession', data.oldSessions);

    // Calculate quiz time
    const countTime = data.questions.reduce((count, question) => count + question.timeLimit, 0);
    if (countTime !== 0) {
      const min = Math.floor(countTime / 60);
      const sec = Math.floor(countTime % 60);
      if (min === 0) {
        setQuizTime(`${sec} seconds`);
      } else if (sec === 0) {
        setQuizTime(`${min} minutes`);
      } else {
        setQuizTime(`${min} minutes ${sec} seconds`);
      }
    }
    setQuizDetails(data);
    setQuestionCount(data.questions.length);
    setAllSessionIDs(data.oldSessions);
  };

  useEffect(async () => {
    await fetchQuiz();
  }, []);

  useEffect(() => {
    // Get session results for every sessionID from oldSession
    setPrevSession([]);
    for (const index in allSessionIDs) {
      getResult(allSessionIDs[index]);
    }
  }, [allSessionIDs]);

  const viewSession = (index) => {
    const passState = { quiz: quizDetails, session: prevSession[index], time: quizTime };
    console.log('state', passState);
    navigate(`/previousSession/${quizID}/${allSessionIDs[index]}`, { state: passState });
  }

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
              <Button size="0.9rem" bgcolor="skyblue" onClick={() => { navigate('/dashboard') }}>Back to Dashboard</Button>
              <Typography variant="h4" component="div" align="center">Previous Sessions of {quizDetails.name}</Typography>
            </Box>
            <Grid container spacing={5} justifyContent="center" alignItems="center">
                <Grid item xs={12} sm={5}>
                    <img
                        src={(quizDetails.thumbnail === null || quizDetails.thumbnail === '')
                          ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
                          : quizDetails.thumbnail}
                        alt="Quiz Thumbnail"
                        loading="lazy"
                        style={{ width: '100%', maxHeight: '250px' }}
                    />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <Typography variant="h5" component="div">Number of questions: {questionCount}</Typography>
                  <Typography variant="h5" component="div">Quiz time: {quizTime}</Typography>
                  <Typography variant="h5" component="div">Number of sessions: {allSessionIDs.length}</Typography>
                </Grid>
            </Grid>
            {allSessionIDs.length === 0
              ? (
                <Typography variant="h4" component="div" align="center">This quiz has never been played before :/</Typography>
                )
              : (
                <Grid container sx={{ padding: '1rem' }} spacing={3} alignItems="flex-end">
                  {prevSession.map((session, index) => (
                    <Grid
                        item
                        key={index}
                        xs={12}
                        sm={6}
                        md={4}
                        onClick={() => viewSession(index)}
                    >
                      <Card sx={{ maxWidth: 500, border: '2px solid teal' }}>
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">Session ID: {allSessionIDs[index]}</Typography>
                            <Typography variant="body2" color="text.secondary">Number of players: {session.results.length}</Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
                )}
            </Container>
        </>
  )
};

export default PreviousSession;
