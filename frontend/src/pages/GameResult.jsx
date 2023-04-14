import React from 'react';
import { useParams } from 'react-router-dom';
// import { checkToken } from './Refresh';

const GameResult = () => {
//   const navigate = useNavigate();
//   checkToken('/game');
  const sessionId = useParams().sessionid;
  return (
    <>
        Game result: {sessionId}
    </>
    // <>
    // {sessionId}
    // </>
  );
};

export default GameResult;
