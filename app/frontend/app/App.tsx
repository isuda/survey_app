import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmailPage from '../features/email/components/EmailPage';
import SurveyRoutes from '../features/survey/routes/SurveyRoutes';
import ThankYouPage from '../features/result/components/ThankYouPage';
import { UserProvider } from './context/UserContext';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<EmailPage />} />
          <Route 
            path="/survey/*" 
            element={
              <PrivateRoute>
                <SurveyRoutes />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/thank-you" 
            element={
              <PrivateRoute>
                <ThankYouPage />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
