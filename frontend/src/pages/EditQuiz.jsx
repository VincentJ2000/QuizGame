import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button
} from '@mui/material'

const EditQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizID = params.quizID;

  const [update, setUpdate] = useState(false);
  const [quizDetails, setQuizDetails] = useState({});
  const [quizName, setQuizName] = useState('');
  const [quizThumbnail, setQuizThumbnail] = useState('');
  const questionID = 1;
  //   const [questionID, setQuestionID] = useState(1);

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
    setQuizName(data.name);
    setQuizThumbnail(data.thumbnail);
  }

  useEffect(async () => {
    await fetchQuiz();
  }, [update]);

  const updateQuiz = async () => {
    await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: quizDetails.questions,
        name: quizName,
        thumbnail: quizThumbnail,
      })
    });
    setUpdate(!update);
  }

  const addQuestion = () => {
    navigate(`/edit/${quizID}/${questionID}`);
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
            <Typography variant="h4" component="div" align="center">Questions of {quizDetails.name}</Typography>
            <Grid container spacing={5} justifyContent="center">
                <Grid item xs={5}>
                    <img
                        src={(quizThumbnail === null || quizThumbnail === '')
                          ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
                          : quizThumbnail}
                        alt="Quiz Thumbnail"
                        loading="lazy"
                        style={{ width: '100%', maxHeight: '250px' }}
                    />
                </Grid>
                <Grid item xs={5}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <TextField
                                id="quizName"
                                label="Quiz Name"
                                value={quizName}
                                onChange={(e) => setQuizName(e.target.value)}
                                type="text"
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                        <Grid item>
                            <Typography>Upload Image File</Typography>
                            <input
                            type="file"
                            name="quizThumbnail"
                            id="quizThumbnail"
                            onChange={(e) => setQuizThumbnail(e.target.value)}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={updateQuiz}>Update Name & Thumbnail</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Button variant="contained" fullWidth onClick={addQuestion}>Add Question</Button>
        </Container>
    </>
  )
}

export default EditQuiz;
