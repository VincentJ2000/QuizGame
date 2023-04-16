import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox
} from '@mui/material'
import fileToDataUrl from './helpers.js';

const EditQuestion = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizID = params.quizID;
  const questionID = params.questionID;

  const [quizDetails, setQuizDetails] = useState({});
  const [updateState, setUpdateState] = useState('Add');
  const [questionType, setQuestionType] = useState('SC');
  const [question, setQuestion] = useState('');
  const [answerCount, setAnswerCount] = useState(2);
  const [answerList, setAnswerList] = useState([
    { id: 1, answer: '', correct: false },
    { id: 2, answer: '', correct: false },
  ]);
  const [timeLimit, setTimeLimit] = useState(30);
  const [points, setPoints] = useState(1);
  const [attachmentType, setAttachmentType] = useState('none');
  const [imageAttachment, setImageAttachment] = useState('');
  const [attachment, setAttachment] = useState('');

  const fetchQuiz = async () => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await response.json();
    setQuizDetails(data);
    // Found existing question details
    if (data.questions.length >= questionID) {
      const currQuestion = data.questions[questionID - 1];
      setQuestionType(currQuestion.type);
      setQuestion(currQuestion.question);
      setAnswerCount(currQuestion.answerList.length);
      setAnswerList(currQuestion.answerList);
      setTimeLimit(currQuestion.timeLimit);
      setPoints(currQuestion.points);
      setAttachmentType(currQuestion.attachmentType);
      setAttachment(currQuestion.attachment);
      setImageAttachment(currQuestion.attachment);
      setUpdateState('Edit');
    }
  }

  useEffect(async () => {
    await fetchQuiz();
  }, []);

  const handleSetAnswer = (event, index) => {
    const newList = [...answerList];
    newList[index].answer = event.target.value;
    setAnswerList(newList);
  };

  const handleCorrectAnswer = (event, index) => {
    if (questionType === 'SC') {
      const check = answerList.filter((data) => data.correct);
      if (check.length === 1) {
        const newList = [...answerList];
        newList[check[0].id - 1].correct = false;
        setAnswerList(newList);
      }
    }
    const newList = [...answerList];
    newList[index].correct = event.target.checked;
    setAnswerList(newList);
  };

  const addMoreAnswers = () => {
    if (answerCount < 6) {
      const newCount = answerCount + 1;
      setAnswerCount(newCount);
      setAnswerList([...answerList, { id: newCount, answer: '', correct: false }]);
    }
  };

  const delMoreAnswers = () => {
    if (answerCount > 2) {
      const newCount = answerCount - 1;
      setAnswerCount(newCount);
      const newList = answerList;
      newList.pop();
      setAnswerList(newList);
    }
  };

  const handleAttachment = (e) => {
    setImageAttachment(e.target.files[0]);
  };

  useEffect(() => {
    if (imageAttachment !== '' && attachmentType === 'image') {
      fileToDataUrl(imageAttachment)
        .then((data) => {
          setAttachment(data);
        })
        .catch(() => {
          alert('Base64 error.');
          setImageAttachment('');
        })
    }
  }, [imageAttachment]);

  const uploadAttachment = () => {
    if (attachmentType !== 'none') {
      if (attachmentType === 'image') {
        return (<Grid item>
                  <Typography>Upload Image File</Typography>
                  <input
                    type="file"
                    name="attachment"
                    id="attachment"
                    onChange={handleAttachment}
                  />
                </Grid>)
      } else if (attachmentType === 'video') {
        return (<Grid item>
                  <TextField
                      required
                      id="attachment"
                      label="Embedded Video URL"
                      value={attachment}
                      onChange={(e) => setAttachment(e.target.value)}
                      type="text"
                      fullWidth
                      variant="standard"
                  />
              </Grid>)
      }
    }
  };

  const updateQuestion = async () => {
    const newQuestion = quizDetails.questions;
    const finalQuestion = {
      id: questionID,
      type: questionType,
      question,
      answerList,
      timeLimit,
      points,
      attachmentType,
      attachment
    };
    if (updateState === 'Add') {
      newQuestion.push(finalQuestion);
    } else {
      newQuestion[questionID - 1] = finalQuestion;
    }

    await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: newQuestion,
        name: quizDetails.name,
        thumbnail: quizDetails.thumbnail,
      })
    });
    navigate('/edit/' + quizID);
  }

  const goToQuiz = () => {
    navigate('/edit/' + quizID);
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
        <Typography variant="h4" component="div" align="center">Question {questionID} of {quizDetails.name}</Typography>
        <Grid container spacing={1} direction="row" alignItems="center" justifyContent="center">
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="questionType">Question Type</InputLabel>
              <Select
                labelId="questionType-label"
                id="questionType-select"
                value={questionType}
                label="Question Type"
                onChange={(e) => setQuestionType(e.target.value)}
              >
                <MenuItem value='SC'>Single Choice</MenuItem>
                <MenuItem value='MC'>Multiple Choice</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="timeLimit">Time Limit</InputLabel>
              <Select
                labelId="timeLimit-label"
                id="timeLimit-select"
                value={timeLimit}
                label="Time Limit"
                onChange={(e) => setTimeLimit(e.target.value)}
              >
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={90}>1 minute 30 seconds</MenuItem>
                <MenuItem value={120}>2 minutes</MenuItem>
                <MenuItem value={180}>3 minutes</MenuItem>
                <MenuItem value={240}>4 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="points">Points</InputLabel>
              <Select
                labelId="points-label"
                id="points-select"
                value={points}
                label="Points"
                onChange={(e) => setPoints(e.target.value)}
              >
                <MenuItem value={1}>One</MenuItem>
                <MenuItem value={2}>Two</MenuItem>
                <MenuItem value={3}>Three</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel id="attachmentType">Attachment Type</InputLabel>
              <Select
                labelId="attachmentType-label"
                id="attachmentType-select"
                value={attachmentType}
                label="Attachment Type"
                onChange={(e) => setAttachmentType(e.target.value)}
              >
                <MenuItem value='none'>None</MenuItem>
                <MenuItem value='image'>Image</MenuItem>
                <MenuItem value='video'>Video</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        {uploadAttachment()}
        <TextField
            required
            id="question"
            label="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <Grid
          container
          spacing={3}
          sx={{ marginTop: '1rem' }}
          justifyContent="center"
          alignItems="center"
        >
          {answerList.map((data, index) => (
            <Grid item xs={6} key={index}>
              <Grid container spacing={1} direction="row" alignItems="center" sx={{ paddingBottom: '1rem', border: '2px solid teal' }}>
                <Grid item xs={9} sm={10}>
                    <TextField
                      required
                      id={toString(data.id)}
                      label={'Answer ' + data.id}
                      value={data.answer}
                      onChange={(e) => handleSetAnswer(e, index)}
                      type="text"
                      fullWidth
                      variant="standard"
                  />
                </Grid>
                <Grid item xs={1}>
                  <FormControlLabel
                      control={<Checkbox checked={data.correct} onChange={(e) => handleCorrectAnswer(e, index)} id={toString(data.id)} size="large" />}
                  />
                </Grid>
              </Grid>
            </Grid>
          ))}
        </Grid>
        <Grid container spacing={2} justifyContent="center">
          {(answerCount < 6) ? <Grid item xs={6}><Button fullWidth variant="outlined" onClick={addMoreAnswers}>Add more answers</Button></Grid> : null}
          {(answerCount > 2) ? <Grid item xs={6}><Button fullWidth variant="outlined" color="error" onClick={delMoreAnswers}>Delete last answer option</Button></Grid> : null}
        </Grid>
        <Grid
          container
          spacing={2}
          sx={{ marginTop: '1rem' }}
          justifyContent="center"
          alignItems="center"
        >
          <Grid item><Button variant='contained' color='success' onClick={goToQuiz}>Go back to Quiz</Button></Grid>
          <Grid item><Button variant='contained' onClick={updateQuestion}>{updateState} Question</Button></Grid>
        </Grid>
      </Container>
    </>
  )
}

export default EditQuestion;
