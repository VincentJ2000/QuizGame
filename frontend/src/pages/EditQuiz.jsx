import React from 'react';
import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import {
  Box,
} from '@mui/material'

const EditQuiz = ({ props }) => {
  const { quizID } = useParams();

  return (
    <>
        <Navbar></Navbar>
      <Box>{quizID}</Box>
    </>
  )
}

export default EditQuiz;
