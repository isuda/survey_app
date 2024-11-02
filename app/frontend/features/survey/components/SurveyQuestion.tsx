import React, { useState } from 'react';
import SurveyScaleQuestion from './questions/SurveyScaleQuestion';
import SurveyTextQuestion from './questions/SurveyTextQuestion';
import { validateSurveyResponse } from '../utils/validation';
import { Question } from '../api/types';

interface SurveyQuestionProps {
  question: Question;
  onChange: (questionId: number, response: any) => void;
  value?: any;
}

const SurveyQuestion: React.FC<SurveyQuestionProps> = ({ question, onChange, value }) => {
  const [error, setError] = useState<string | null>(null);

  const handleResponseChange = (response: any) => {
    const validationError = validateSurveyResponse(response, question.type, {
      min: question.min,
      max: question.max,
      limit: question.limit
    });

    setError(validationError);
    if (!validationError) {
      onChange(question.id, response);
    }
  };

  return (
    <div>
      {question.type === 'scale' ? (
        <SurveyScaleQuestion
          question={question}
          onChange={handleResponseChange}
          value={value}
          error={error}
        />
      ) : (
        <SurveyTextQuestion
          question={question}
          onChange={handleResponseChange}
          value={value}
          error={error}
        />
      )}
    </div>
  );
};

export default SurveyQuestion;
