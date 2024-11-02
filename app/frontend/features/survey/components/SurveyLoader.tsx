import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, CircularProgress } from '@mui/material';
import { useFetchSurvey } from '../api/hooks/useFetchSurvey';
import { useSurveyContext } from '../context/SurveyContext';

const SurveyLoader: React.FC = () => {
  const navigate = useNavigate();
  const { surveys, loading, error } = useFetchSurvey();
  const { setSurvey } = useSurveyContext();

  useEffect(() => {
    if (!loading && surveys && surveys.length > 0) {
      const firstSurvey = surveys[0];
      setSurvey(firstSurvey);
      navigate(`/survey/${firstSurvey.id}/question/${firstSurvey.questions[0].id}`);
    }
  }, [loading, surveys, setSurvey, navigate]);

  if (error) {
    return (
      <Container>
        <div>Error loading survey: {error}</div>
      </Container>
    );
  }

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <CircularProgress />
    </Container>
  );
};

export default SurveyLoader;
