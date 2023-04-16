import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  CardHeader,
  FormControlLabel,
  Checkbox
} from '@mui/material'
import fileToDataUrl from './helpers.js';

const EditQuiz = () => {
  const navigate = useNavigate();
  const params = useParams();
  const quizID = params.quizID;

  const [update, setUpdate] = useState(false);
  const [quizDetails, setQuizDetails] = useState({});
  const [questionList, setQuestionList] = useState([]);
  const [quizName, setQuizName] = useState('');
  const [quizThumbnail, setQuizThumbnail] = useState('');
  const [previewThumbnail, setPreviewThumbnail] = useState(null);

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
    setQuestionList(data.questions);
    setQuizName(data.name);
    setPreviewThumbnail(data.thumbnail);
  };

  useEffect(async () => {
    await fetchQuiz();
  }, [update]);

  const handleThumbnail = (e) => {
    setQuizThumbnail(e.target.files[0]);
  };

  useEffect(() => {
    if (quizThumbnail !== '') {
      fileToDataUrl(quizThumbnail)
        .then((data) => {
          setPreviewThumbnail(data);
        })
        .catch(() => {
          alert('Base64 error.');
          setQuizThumbnail('');
        })
    }
  }, [quizThumbnail]);

  const updateQuiz = async () => {
    await fetch(`http://localhost:5005/admin/quiz/${quizID}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        questions: questionList,
        name: quizName,
        thumbnail: previewThumbnail,
      })
    });
    setUpdate(!update);
  };

  const addQuestion = () => {
    navigate(`/edit/${quizID}/${questionList.length + 1}`);
  };

  const editQuestion = (questionID) => {
    navigate(`/edit/${quizID}/${questionID}`);
  };

  const deleteQuestion = (questionID) => {
    const index = questionID - 1;
    const newQuestions = questionList;
    newQuestions.splice(index, 1);
    console.log('new', newQuestions);
    setQuestionList(newQuestions);
    updateQuiz();
  };

  const attachmentComponent = (attachmentType, attachment) => {
    if (attachmentType !== 'none') {
      if (attachmentType === 'image') {
        return (<CardMedia
          component="img"
          alt="img"
          height="250"
          image={attachment}
        />)
      } else if (attachmentType === 'video') {
        return (<CardMedia
          component="video"
          alt="video"
          height="140"
          image={attachment}
        />)
      }
    }
    return (<CardMedia
      component="img"
      alt="img"
      height="250"
      image='https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
    />)
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
            <Typography variant="h4" component="div" align="center">Questions of {quizDetails.name}</Typography>
            <Grid container spacing={5} justifyContent="center">
                <Grid item xs={5}>
                    <img
                        src={(previewThumbnail === null || previewThumbnail === '')
                          ? 'https://t4.ftcdn.net/jpg/02/07/87/79/240_F_207877921_BtG6ZKAVvtLyc5GWpBNEIlIxsffTtWkv.jpg'
                          : previewThumbnail}
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
                              onChange={handleThumbnail}
                            />
                        </Grid>
                        <Grid item>
                            <Button variant="outlined" onClick={updateQuiz}>Update Name & Thumbnail</Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Button variant="contained" fullWidth onClick={addQuestion}>Add Question</Button>
            {questionList && questionList.map((data) => (
              <Card key={data.id} sx={{ width: '100%' }}>
                <CardHeader
                  title={'Question ' + data.id + ': ' + data.question}
                  subheader={'Points: ' + data.points + ', Time Limit: ' + data.timeLimit}
                />
                <CardContent>
                  <Grid
                    container
                    spacing={2}
                  >
                    <Grid item xs={6}>{attachmentComponent(data.attachmentType, data.attachment)}</Grid>
                    <Grid item xs={6}>
                      <Grid container >
                        <Typography gutterBottom variant="h6" component="div">Answer List</Typography>
                        <Grid
                          container
                          spacing={3}
                          sx={{ marginTop: '0.5rem' }}
                          justifyContent="center"
                          alignItems="center"
                        >
                        {data.answerList.map((ans, index) => (
                          <Grid item xs={6} key={index}>
                            <Grid container spacing={1} direction="row" alignItems="center" sx={{ paddingBottom: '1rem', border: '2px solid teal' }}>
                              <Grid item xs={8}>
                                  <Typography key={ans.id}>{ans.answer}</Typography>
                              </Grid>
                              <Grid item xs={1}>
                                <FormControlLabel
                                    control={<Checkbox checked={ans.correct} key={ans.id} size="large" />}
                                />
                              </Grid>
                            </Grid>
                          </Grid>
                        ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </CardContent>
                <CardActions sx={{ padding: '1rem', justifyContent: 'center' }}>
                  <Button fullWidth sx={{ bgcolor: '#fb8c00', color: 'white' }} onClick={() => editQuestion(data.id)}>Edit Question</Button>
                  <Button fullWidth sx={{ bgcolor: '#ef5350', color: 'white' }} onClick={() => deleteQuestion(data.id)}>Delete Question</Button>
                </CardActions>
              </Card>
            ))}
        </Container>
    </>
  )
}

export default EditQuiz;
