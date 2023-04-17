import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { checkToken } from './Refresh';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '../components/Button';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const AdminScreen = () => {
  const navigate = useNavigate();
  const sessionId = useParams().sessionid;
  const quizId = useParams().quizid;
  const [errorMessage, setErrorMessage] = React.useState(null);
  const [finished, setFinished] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [progress, setProgress] = React.useState(0);
  const [leaderboardData, setLeaderboardData] = React.useState(null);
  const [chartData, setChartData] = React.useState({});
  const [chartData2, setChartData2] = React.useState({});
  const [options, setOptions] = React.useState({});
  const [options2, setOptions2] = React.useState({});
  checkToken(`/game/admin/${sessionId}/${quizId}`, true);

  // get game status
  React.useEffect(() => {
    async function getGameStatus () {
      const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/status`, {
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
        if (data.results.active === true) {
          setFinished(false)
        } else {
          setFinished(true)
        }
      }
    }
    getGameStatus()
  }, [sessionId]);

  // advance to the next question
  async function advanceQuestion () {
    const response = await fetch(`http://localhost:5005/admin/quiz/${quizId}/advance`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        authorization: `Bearer ${localStorage.getItem('token')}`
      },
    });
    const data = await response.json();
    console.log(data)
    if (data.error) {
      setErrorMessage(data.error);
    }
  }

  // stop quiz
  async function stopQuiz (quizID) {
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
      setFinished(true);
    }
  }

  // get results
  async function getResult () {
    const response = await fetch(`http://localhost:5005/admin/session/${sessionId}/results`, {
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
      setResult(data);
    }
  }

  // get result when game is finished or stopped
  React.useEffect(() => {
    if (finished) {
      getResult();
    }
  }, [finished]);
  React.useEffect(() => {
    leaderboard();
  }, [result]);

  // for progress
  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress >= 100 ? 100 : prevProgress + 10));
    }, 800);

    return () => {
      clearInterval(timer);
    };
  }, []);

  // get list of player and their scores
  const leaderboard = () => {
    const scores = result &&
      Object.values(result).map((player) => {
        const playerList = [];
        // const questionList = [];
        let playerName = '';
        player.forEach((playerScore) => {
          let totalPlayerScore = 0;
          const questionList = []
          const questionTimeList = []
          playerScore.answers.forEach((answer, index) => {
            const date1 = new Date(answer.questionStartedAt);
            const date2 = new Date(answer.answeredAt);
            const diffSeconds = (date2 - date1) / 1000;
            questionTimeList.push(diffSeconds)
            if (answer.correct) {
              totalPlayerScore++;
              questionList.push(index + 1)
            }
          });
          playerName = playerScore.name
          const result = {
            name: playerName,
            score: totalPlayerScore,
            correctQuestions: questionList,
            timeTaken: questionTimeList
          };
          playerList.push(result)
        });
        return playerList;
      })
    if (scores) {
      scores[0].sort((a, b) => b.score - a.score);
    }
    setLeaderboardData(scores);
  }

  // filter top players
  const totalPlayer = leaderboardData && leaderboardData[0].length
  const topPlayers = leaderboardData && leaderboardData[0].slice(0, 5);
  // for each question get the amount of people getting the correct answers
  React.useEffect(() => {
    if (leaderboardData) {
      const correctQuestionCount = {};
      Object.values(leaderboardData[0]).forEach(player => {
        player.correctQuestions.forEach(question => {
          if (correctQuestionCount[question]) {
            correctQuestionCount[question]++;
          } else {
            correctQuestionCount[question] = 1;
          }
        });
      });
      const questionCountArray = Object.keys(correctQuestionCount).map(question => {
        return { question, count: correctQuestionCount[question] };
      });
      // for chart
      if (questionCountArray) {
        const labels = questionCountArray.map(q => 'question ' + q.question);
        const data = questionCountArray.map(q => q.count);
        setChartData({
          labels: labels,
          datasets: [
            {
              label: '% of people who got the question correct',
              data: data.map((count) => ((count / totalPlayer) * 100).toFixed(2)),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
        setOptions({
          scales: {
            y: {
              beginAtZero: true
            }
          }
        });
      }

      // Average response/answer time
      const questionAverages = {};
      leaderboardData[0].forEach((person) => {
        person.timeTaken.forEach((time, index) => {
          if (questionAverages[index]) {
            questionAverages[index].total += time;
            questionAverages[index].count += 1;
          } else {
            questionAverages[index] = {
              total: time,
              count: 1,
            };
          }
        });
      });
      Object.entries(questionAverages).forEach(([question, { total, count }]) => {
        const average = count === 0 ? 0 : total / count;
        questionAverages[question] = {
          question: Number(question) + 1,
          averageTimeTaken: average
        };
      });
      // for chart
      if (questionAverages) {
        const labels2 = Object.values(questionAverages).map(q => 'question ' + q.question);
        const data2 = Object.values(questionAverages).map(q => q.averageTimeTaken);
        setChartData2({
          labels: labels2,
          datasets: [
            {
              label: 'Average time taken to answer each question in seconds',
              data: data2,
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        });
        setOptions2({
          scales: {
            y: {
              beginAtZero: true
            }
          }
        });
      }
    }
  }, [leaderboardData]);

  return (
    <Box sx={{
      backgroundColor: '#00695c',
      height: '100vh',
      width: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
    }}>
      {errorMessage && (
        <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {errorMessage}
        </Alert>
      )}
      {finished
        ? (
            <>
              {progress < 100
                ? (
                  <CircularProgress variant="determinate" color='error' value={progress} />
                  )
                : (
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
                    {leaderboardData
                      ? <>
                          <Box sx={{ width: '80vw', height: '100px', marginTop: '400px', display: 'flex', justifyContent: 'space-around' }}>
                            Leaderboard
                            <Button onClick={() => { navigate('/dashboard') }}>Back to Dashboard</Button>
                          </Box>
                          <TableContainer component={Paper}>
                            <Table sx={{ border: '5px solid #00695c' }}>
                              <TableHead>
                                <TableRow>
                                  <TableCell colSpan={2} align="center" sx={{ fontSize: '22px' }}>Top 5 Players</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell align="center">Player Name</TableCell>
                                  <TableCell align="center">Score</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {topPlayers.map((player, index) => (
                                  <TableRow key={index}>
                                    <TableCell component="th" scope="row" align="center">
                                      {player.name}
                                    </TableCell>
                                    <TableCell align="center">{player.score}</TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                          <Box sx={{ width: '70vw', height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Bar data={chartData} options={options} />
                          </Box>
                          <Box sx={{ width: '70vw', height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                            <Bar data={chartData2} options={options2} />
                          </Box>
                        </>
                      : 'Loading Results'
                    }
                  </Box>
                  )}
            </>
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
                flexDirection: 'column'
              }}>
                {/* ONCE THE QUESTION HAS FINISHED THE TIME LIMIT ADVANCE */}
                <Button full='true' onClick={() => { advanceQuestion() }}>Next Question</Button>
                <Button full='true' bgcolor='white' onClick={() => { stopQuiz(quizId) }}>Stop Quiz</Button>
              </Box>
            </>
          )}
    </Box>
  );
};

export default AdminScreen;
