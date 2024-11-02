import { useState } from 'react';
import { getCsrfToken } from '../../../../utils/csrfToken';
import { SurveyResponse } from '../types';

interface SubmitData {
  email: string;
  responses: SurveyResponse[];
}

export const useSubmitSurveyResponse = (surveyId: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitResponse = async (data: SubmitData): Promise<boolean> => {
    setLoading(true);
    try {
      const csrfToken = getCsrfToken();
      const response = await fetch(`/api/v1/surveys/${surveyId}/survey_responses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken || '',
        },
        body: JSON.stringify({
          survey_response: {
            email: data.email,
            responses: data.responses,
          },
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit survey responses');
      }
      
      return true;
    } catch (err) {
      console.error('Error submitting survey responses:', err);
      setError((err as Error).message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { submitResponse, loading, error };
};
