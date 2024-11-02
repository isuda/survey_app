import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SurveyLoader from '../components/SurveyLoader';
import SurveyPage from '../components/SurveyPage';
import { SurveyProvider } from '../context/SurveyContext';

const SurveyRoutes: React.FC = () => {
  return (
    <SurveyProvider>
      <Routes>
        <Route path="/" element={<SurveyLoader />} />
        <Route path="/:surveyId/question/:questionId" element={<SurveyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </SurveyProvider>
  );
};

export default SurveyRoutes;
