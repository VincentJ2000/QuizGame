/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  console.log('See question: ', question);
  const playerQuestion = question;
  delete playerQuestion['answerList'];
  console.log('See question: ', playerQuestion);
  return playerQuestion;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  // Returns an array of correct answer IDs
  const correctAnswers = question.answerList.filter((data) => data.correct === true).map((ans) => ans.id);
  return correctAnswers; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  // Returns an array of answer IDs
  const answerArray = question.answerList.map((ans) => ans.id);
  return answerArray; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timeLimit;
};
