import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
} from '@mui/material'

const EditQuiz = ({ props }) => {
  const { quizID } = useParams();

  return (
    <>
      <Box>{quizID}</Box>
    </>
  )
}

export default EditQuiz;
