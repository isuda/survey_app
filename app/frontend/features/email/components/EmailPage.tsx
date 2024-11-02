import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box
} from '@mui/material';
import { isValidEmail } from '../utils/validation';
import { useUserContext } from '../../../app/context/UserContext';

const EmailPage: React.FC = () => {
  const { setEmail } = useUserContext();
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmailInput(event.target.value);
    if (emailError && isValidEmail(event.target.value)) {
      setEmailError('');
    }
  };

  const handleGetStarted = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailInput || !isValidEmail(emailInput)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    setEmail(emailInput);
    navigate('/survey');
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 3
      }}
    >
      <Card>
        <CardContent sx={{ p: 4 }}>
          <Typography
            variant="h4"
            component="h1"
            align="center"
          >
            Mental Health Survey
          </Typography>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
          >
            Your feedback helps us understand and improve mental health support.
            Please enter your email to begin.
          </Typography>
          <Box
            component="form"
            onSubmit={handleGetStarted}
            noValidate
            sx={{ mt: 4 }}
          >
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              value={emailInput}
              onChange={handleInputChange}
              error={!!emailError}
              helperText={emailError}
              sx={{ mb: 3 }}
              slotProps={{ htmlInput: { 'aria-label': 'email address' } }}
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              fullWidth
              size="large"
            >
              Start Survey
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default EmailPage;
