/*
 For a given data structure of a question, produce another
 object that doesn't contain any important meta data (e.g. the answer)
 to return to a "player"
*/
export const quizQuestionPublicReturn = question => {
  const playerQuestion = { ...question };
  const answerArray = playerQuestion.answerList.map(({ id, answer }) => ({ id, answer }));
  playerQuestion['questionList'] = answerArray
  delete playerQuestion['answerList']
  return playerQuestion;
};

/*
 For a given data structure of a question, get the IDs of
 the correct answers (minimum 1).
*/
export const quizQuestionGetCorrectAnswers = question => {
  // Returns an array of correct answer IDs
  const playerQuestion = { ...question };
  const correctAnswers = playerQuestion.answerList.filter((data) => data.correct).map((ans) => ans.id);
  return correctAnswers; // For a single answer
};

/*
 For a given data structure of a question, get the IDs of
 all of the answers, correct or incorrect.
*/
export const quizQuestionGetAnswers = question => {
  // Returns an array of answer IDs
  const playerQuestion = { ...question };
  const answerArray = playerQuestion.answerList.map(({ id }) => ({ id }));
  return answerArray; // For a single answer
};

/*
 For a given data structure of a question, get the duration
 of the question once it starts. (Seconds)
*/
export const quizQuestionGetDuration = question => {
  return question.timeLimit;
};