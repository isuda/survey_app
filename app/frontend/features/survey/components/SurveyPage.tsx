import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box } from '@mui/material';
import { useSurveyContext } from '../context/SurveyContext';
import { useUserContext } from '../../../app/context/UserContext';
import SurveyQuestion from './SurveyQuestion';
import { useSubmitSurveyResponse } from '../api/hooks/useSubmitSurveyResponse';

const SurveyPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentResponse, setCurrentResponse] = useState<string | number>();
  const { surveyId, questionId } = useParams<{ surveyId: string; questionId: string }>();
  const { email } = useUserContext();
  const { responses, addResponse, survey, clearResponses } = useSurveyContext();

  if (!survey) {
    navigate('/');
    return null;
  }

  // Find current question
  const parsedQuestionId = parseInt(questionId || '1', 10);
  const currentQuestionIndex = survey.questions.findIndex(q => q.id === parsedQuestionId);

  const currentQuestion = survey.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;

  const handleResponseChange = (questionId: number, value: string | number) => {
    setCurrentResponse(value);
  };

  const getCurrentQuestionResponse = () => {
    let value = currentResponse;

    // Convert to number for scale questions
    if (currentQuestion.type === 'scale') {
      value = Number(value) || Math.floor((currentQuestion.max! + currentQuestion.min!) / 2);
    }

    // For text questions, ensure we at least have an empty string
    if (currentQuestion.type === 'text') {
      value = value || '';
    }

    return value;
  };

  const { submitResponse } = useSubmitSurveyResponse(survey.id);

  const [pendingSubmission, setPendingSubmission] = useState(false);

  useEffect(() => {
    const submitSurvey = async () => {
      if (pendingSubmission) {
        const success = await submitResponse({
          email,
          responses,
        });

        if (success) {
          clearResponses();
          navigate('/thank-you');
        }
        setPendingSubmission(false);
      }
    };

    submitSurvey();
  }, [responses, pendingSubmission]);

  const handleNext = () => {
    // Get the current response
    const value = getCurrentQuestionResponse();
    const newResponse = { question_id: currentQuestion.id, value };

    // Update the responses in context
    addResponse(newResponse);

    if (isLastQuestion) {
      setPendingSubmission(true);
    } else {
      const nextQuestion = survey.questions[currentQuestionIndex + 1];
      navigate(`/survey/${surveyId}/question/${nextQuestion.id}`);
    }
  };

  const handlePrevious = () => {
    if (!isFirstQuestion) {
      const prevQuestion = survey.questions[currentQuestionIndex - 1];
      navigate(`/survey/${surveyId}/question/${prevQuestion.id}`);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ py: 4 }}
      role="main"
    >
      <Typography variant="h4" gutterBottom align="center">
        {survey.name}
      </Typography>

      <Box sx={{ my: 4 }}>
        <SurveyQuestion
          question={currentQuestion}
          onChange={handleResponseChange}
          value={responses.find(r => r.question_id === currentQuestion.id)?.value}
        />
      </Box>

      <Box
        display="flex"
        justifyContent="space-between"
        mt={4}
        sx={{ gap: 2 }}
      >
        <Button
          variant="outlined"
          onClick={handlePrevious}
          disabled={isFirstQuestion}
          aria-label="Previous question"
        >
          Previous
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNext}
          aria-label={isLastQuestion ? "Submit survey" : "Next question"}
        >
          {isLastQuestion ? 'Submit' : 'Next'}
        </Button>
      </Box>
    </Container>
  );
};

export default SurveyPage;
