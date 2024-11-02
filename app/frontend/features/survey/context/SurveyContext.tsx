import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Survey, SurveyResponse } from '../api/types';

interface SurveyContextType {
  survey: Survey | null;
  responses: SurveyResponse[];
  setSurvey: (survey: Survey | null) => void;
  addResponse: (response: SurveyResponse) => void;
  clearResponses: () => void;
}

const SurveyContext = createContext<SurveyContextType | undefined>(undefined);

export const SurveyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  const addResponse = (response: SurveyResponse) => {
    setResponses(prev => {
      const filtered = prev.filter(r => r.question_id !== response.question_id);
      return [...filtered, response];
    });
  };

  const clearResponses = () => setResponses([]);

  return (
    <SurveyContext.Provider
      value={{
        survey,
        responses,
        setSurvey,
        addResponse,
        clearResponses
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurveyContext = () => {
  const context = useContext(SurveyContext);
  if (context === undefined) {
    throw new Error('useSurveyContext must be used within a SurveyProvider');
  }
  return context;
};
