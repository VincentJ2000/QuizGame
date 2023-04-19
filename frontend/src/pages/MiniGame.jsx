import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container
} from '@mui/material'

// Inspired by https://github.com/rsinghal26/game
const MiniGame = () => {
  const [timeTaken, setTimeTaken] = useState('0 s');
  const [show, setShow] = useState(true);
  const [delay, setDelay] = useState(true);
  const [displayState, setDisplayState] = useState('block');
  let start = new Date().getTime();
  let count = 0;

  function getRandomColor () {
    const letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  function changeShape () {
    const top = Math.random() * 400;
    const left = Math.random() * 400;
    const height = Math.random() * 200 + 100;
    const width = Math.random() * 200 + 100;
    start = new Date().getTime();
    return (
        <div style={{
          backgroundColor: getRandomColor(),
          height: `${height}px`,
          width: `${width}px`,
          left: `${left}px`,
          top: `${top}px`,
          shape: Math.random() > 0.5 ? '50%' : '0%',
          display: displayState
        }} onClick={function () {
          count++;
          setDisplayState('none');
          const end = new Date().getTime();
          const time = (end - start) / 1000;
          setTimeTaken(`${time} s`);
          if (time > 2) {
            alert('YOUR GAME IS OVER......! YOUR POINT IS: ' + count);
            setShow(false);
            count = 0;
          }
          setDelay(!delay);
        }}>
        </div>
    )
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
      changeShape();
    }, Math.random() * 2000);
    return () => clearTimeout(timer);
  }, [delay])

  return (
    <Container>
        <Box sx={{
          color: 'white',
          fontSize: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
            <Typography>Please Wait, You are in lobby. You can play a game in the meantime!</Typography>
            <Typography>Click on the boxes and circles as quickly as you can!</Typography>
            <Typography>Your Time Is: {timeTaken} </Typography>
        </Box>
        {show ? changeShape() : (<></>)}
    </Container>
  )
}

export default MiniGame;
