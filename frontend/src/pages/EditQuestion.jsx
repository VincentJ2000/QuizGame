import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Checkbox
} from '@mui/material'

const EditQuestion = () => {
  const params = useParams();
  const quizID = params.quizID;
  const questionID = params.questionID;

  const [quizDetails, setQuizDetails] = useState({});

  const [questionType, setQuestionType] = useState('SC');
  const [question, setQuestion] = useState('');
  const [answer1, setAnswer1] = useState('');
  const [answer2, setAnswer2] = useState('');
  const [answer3, setAnswer3] = useState('');
  const [answer4, setAnswer4] = useState('');
  const [answer5, setAnswer5] = useState('');
  const [answer6, setAnswer6] = useState('');
  const [timeLimit, setTimeLimit] = useState('');
  const [points, setPoints] = useState('');
  const [attachmentType, setAttachmentType] = useState('image');
  const [attachment, setAttachment] = useState('');
  const [SCAnswer, setSCAnswer] = useState('');
  const [MCAnswer, setMCAnswer] = React.useState({
    answer1: false,
    answer2: false,
    answer3: false,
    answer4: false,
    answer5: false,
    answer6: false,
  });

  const fetchQuiz = async () => {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    });
    const data = await response.json();
    console.log(data);
    setQuizDetails(data);
  }

  useEffect(async () => {
    await fetchQuiz();
  }, []);

  const handleMCAnswer = (event) => {
    setMCAnswer({ ...MCAnswer, [event.target.name]: event.target.checked })
  };

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
        <Grid container spacing={2} justifyContent="center">
            <Grid item xs={3}>
                <FormLabel id="question-type">Question Type</FormLabel>
                <RadioGroup
                    aria-labelledby="question-type"
                    name="question-type"
                    value={questionType}
                    onChange={(e) => { setQuestionType(e.target.value) }}
                >
                    <FormControlLabel value="SC" control={<Radio />} label="Single Choice" />
                    <FormControlLabel value="MC" control={<Radio />} label="Multiple Choice" />
                </RadioGroup>
            </Grid>
            <Grid item xs={3}>
                <FormLabel id="attachment-type">Attachment Type</FormLabel>
                <RadioGroup
                    aria-labelledby="attachment-type"
                    name="attachment-type"
                    value={attachmentType}
                    onChange={(e) => { setAttachmentType(e.target.value) }}
                >
                    <FormControlLabel value="image" control={<Radio />} label="Image" />
                    <FormControlLabel value="video" control={<Radio />} label="Video" />
                </RadioGroup>
            </Grid>
            {(attachmentType === 'image')
              ? (
                <Grid item>
                    <Typography>Upload Image File</Typography>
                    <input
                    type="file"
                    name="attachment"
                    id="attachment"
                    onChange={(e) => setAttachment(e.target.value)}
                    />
                </Grid>
                )
              : (
                <Grid item>
                    <TextField
                        required
                        id="attachment"
                        label="Video URL"
                        value={attachment}
                        onChange={(e) => setAttachment(e.target.value)}
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                </Grid>
                )}
        </Grid>
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
        <TextField
            required
            id="answer1"
            label="Answer 1"
            value={answer1}
            onChange={(e) => setAnswer1(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            required
            id="answer2"
            label="Answer 2"
            value={answer2}
            onChange={(e) => setAnswer2(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            id="answer3"
            label="Answer 3"
            value={answer3}
            onChange={(e) => setAnswer3(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            id="answer4"
            label="Answer 4"
            value={answer4}
            onChange={(e) => setAnswer4(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            id="answer5"
            label="Answer 5"
            value={answer5}
            onChange={(e) => setAnswer5(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            id="answer6"
            label="Answer 6"
            value={answer6}
            onChange={(e) => setAnswer6(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <Grid container spacing={5} justifyContent="center" alignItems="center">
            <Grid item><Typography>Correct Answer: </Typography></Grid>
            <Grid item>
            {(questionType === 'SC')
              ? (
                <RadioGroup
                    row
                    required
                    name="answer-group"
                    value={SCAnswer}
                    onChange={(e) => setSCAnswer(e.target.value)}
                >
                    <FormControlLabel value="1" control={<Radio />} label="1" />
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                    {(answer3 !== '')
                      ? (<FormControlLabel value="3" control={<Radio />} label="3" />)
                      : (<FormControlLabel disabled value="3" control={<Radio />} label="3" />)}
                    {(answer4 !== '')
                      ? (<FormControlLabel value="4" control={<Radio />} label="4" />)
                      : (<FormControlLabel disabled value="4" control={<Radio />} label="4" />)}
                    {(answer5 !== '')
                      ? (<FormControlLabel value="5" control={<Radio />} label="5" />)
                      : (<FormControlLabel disabled value="5" control={<Radio />} label="5" />)}
                    {(answer6 !== '')
                      ? (<FormControlLabel value="6" control={<Radio />} label="6" />)
                      : (<FormControlLabel disabled value="6" control={<Radio />} label="6" />)}
                </RadioGroup>
                )
              : (
                <FormGroup row required>
                    <FormControlLabel
                        control={<Checkbox checked={MCAnswer.answer1} onChange={handleMCAnswer} name="answer1" />}
                        label="1"
                    />
                    <FormControlLabel
                        control={<Checkbox checked={MCAnswer.answer2} onChange={handleMCAnswer} name="answer2" />}
                        label="2"
                    />
                </FormGroup>
                )}
            </Grid>
        </Grid>
        <TextField
            required
            id="timeLimit"
            label="Time Limit"
            value={timeLimit}
            onChange={(e) => setTimeLimit(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <TextField
            required
            id="points"
            label="Points"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            type="text"
            fullWidth
            variant="standard"
        />
        <Button>Add Question</Button>
      </Container>
    </>
  )
}

export default EditQuestion;
