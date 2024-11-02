import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../app/context/UserContext';
import { useSurveyContext } from '../../../features/survey/context/SurveyContext';

const ThankYouPage: React.FC = () => {
  const navigate = useNavigate();
  const { clearUserContext } = useUserContext();

  const handleRestart = () => {
    clearUserContext();
    navigate('/');
  };

  return (
    <Container maxWidth="sm" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box textAlign="center">
        <Typography variant="h4" gutterBottom>Thank you for participating!</Typography>
        <Typography variant="subtitle1">Your responses have been recorded.</Typography>
        <Box mt={4}>
          <Button variant="contained" color="primary" onClick={handleRestart}>
            Restart Survey
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ThankYouPage;
