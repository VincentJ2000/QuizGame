import React from 'react';
import { useParams } from 'react-router-dom';
import { checkToken } from './Refresh';
import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

const GamePlay = () => {
//   const navigate = useNavigate();
  const sessionId = useParams().sessionid;
  const playerId = useParams().playerid;
  const [started, setStarted] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState(null);
  checkToken(`/game/${sessionId}/${playerId}/play`, true);

  React.useEffect(() => {
    async function checkGameStarted () {
      console.log('run')
      const response = await fetch(`http://localhost:5005/play/${playerId}/status`, {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          authorization: `Bearer ${localStorage.getItem('token')}`
        },
      });
      const data = await response.json();
      console.log(data)
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
    checkGameStarted();
  }, [playerId]);

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
            'Game result:' + sessionId
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
                Please Wait, You are in lobby
              </Box>
              <CircularProgress sx={{ color: 'white' }} />
            </>
          )}
    </Box>
  );
};

export default GamePlay;
