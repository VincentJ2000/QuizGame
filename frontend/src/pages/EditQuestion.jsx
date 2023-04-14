import React from 'react';
import {
  Box,
} from '@mui/material'

const EditQuestion = ({ props }) => {
  const quizID = props;
  return (
    <>
      <Box>{quizID}</Box>
    </>
  )
}

export default EditQuestion;
