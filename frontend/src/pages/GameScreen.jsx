import React from 'react';
import { useParams } from 'react-router-dom';
// import { checkToken } from './Refresh';

const GameScreen = () => {
//   const navigate = useNavigate();
//   checkToken('/game');
  const sessionId = useParams().sessionid;
  return (
    <>
        Game: {sessionId}
    </>
    // <>
    // {sessionId}
    // </>
  );
};

export default GameScreen;
