import React from 'react';
import { useParams } from 'react-router-dom';
import { checkToken } from './Refresh';
import { Box, Typography, Button, Grid } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

const GamePlay = () => {
//   const navigate = useNavigate();
  const sessionId = useParams().sessionid;
  const playerId = useParams().playerid;
  const [started, setStarted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [question, setQuestion] = React.useState(null);
  const [timeRemaining, setTimeRemaining] = React.useState(null);
  const prevQuestionRef = React.useRef(null);
  const [selected, setSelected] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);
  const [correctAnswer, setCorrectAnswer] = React.useState(null);
  checkToken(`/game/${sessionId}/${playerId}/play`, true);

  // check game started
  async function checkGameStarted () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
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
      if (data.started === true) {
        setStarted(true);
      } else {
        setStarted(false);
      }
    }
  }
  React.useEffect(() => {
    const interval = setInterval(() => {
      checkGameStarted();
    }, 5000);

    return () => clearInterval(interval);
  }, [playerId]);

  // get question
  async function getQuestion () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/question`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    if (data.error) {
      console.log(data.error);
    } else {
      if (!prevQuestionRef.current || data.question.id !== prevQuestionRef.current.id) {
        setQuestion(data);
        prevQuestionRef.current = data.question;
      }
    }
  }
  React.useEffect(() => {
    const interval = setInterval(() => {
      getQuestion();
    }, 3000);

    return () => clearInterval(interval);
  }, [playerId]);

  // timer
  React.useEffect(() => {
    if (question !== null) {
      setTimeRemaining(question.question.timeLimit)
      setSelected([])
      setCorrectAnswer(null)
    }
  }, [question]);

  React.useEffect(() => {
    if (timeRemaining === 0) {
      getAnswer();
    } else {
      const timer = setTimeout(() => {
        setTimeRemaining(prevTimeRemaining => prevTimeRemaining - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [timeRemaining]);

  // answers
  const handleButtonClick = (id) => {
    if (timeRemaining === 0) {
      return;
    }

    if (question.question.type === 'SC') {
      setSelected([id]);
    } else {
      setSelected((prevSelectedAnswers) => {
        if (prevSelectedAnswers.includes(id)) {
          return prevSelectedAnswers.filter((i) => i !== id);
        } else {
          return [...prevSelectedAnswers, id];
        }
      });
    }
  };

  // send answers
  async function sendAnswers () {
    console.log('run')
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        answerIds: selected
      }),
    });
    const data = await response.json();
    if (data.error) {
      setErrorMessage(data.error);
      console.log(data)
    } else {
      console.log(data)
    }
  }
  React.useEffect(() => {
    if (selected && selected.length) {
      sendAnswers()
    }
  }, [selected]);

  // get correct amswer
  async function getAnswer () {
    const response = await fetch(`http://localhost:5005/play/${playerId}/answer`, {
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
      setAnswer(data)
    }
  }
  // check answer
  React.useEffect(() => {
    if (answer) {
      const getAnswerName = (answerId) => {
        const answer = question.question.questionList.find((answer) => answer.id === answerId);
        return answer ? answer.answer : null;
      }
      const correctAnswers = answer.answerIds.map((answerId) => getAnswerName(answerId));
      setCorrectAnswer(correctAnswers)
    }
  }, [answer])

  return (
    <Box sx={{
      backgroundColor: '#00695c',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}>
      {errorMessage && (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
      )}
      {started
        ? (
            <Box sx={{
              borderRadius: '10px',
              color: 'black',
              bgcolor: 'white',
              fontSize: '40px',
              width: '80vw',
              height: '80vh',
              display: 'flex',
              alignItems: 'center',
              flexDirection: 'column',
              justifyContent: 'space-evenly'
            }}>
              {question &&
                <>
                  {correctAnswer && <Typography>Answer: {correctAnswer.join(', ')}</Typography>}
                  <Typography>Time remaining: {timeRemaining} seconds</Typography>
                  <Typography>{question.question.question}</Typography>
                  {question.question.attachment &&
                    <Box sx={{ width: '30vw', height: '20vh' }}>
                      <img src={question.question.attachment} alt="Question image" style={{ width: '100%', height: '100%' }} />
                    </Box>
                  }
                  <Box width='70vw'>
                    <Grid container spacing={4}>
                      {question.question.questionList.map((answer, index) => (
                        <Grid item xs={6} key={answer.id}>
                          <Button
                            fullWidth
                            variant="contained"
                            style={selected?.includes(answer.id) ? { border: '8px solid lightblue' } : {}}
                            onClick={() => handleButtonClick(answer.id)}
                          >
                            {answer.answer}
                          </Button>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </>
              }
            </Box>
          )
        : (
            <>
              <Box sx={{
                color: 'white',
                fontSize: '40px',
                height: '200px',
                width: '200px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                Please Wait, You are in lobby.
              </Box>
              <CircularProgress sx={{ color: 'white' }} />
            </>
          )}
    </Box>
  );
};

export default GamePlay;
