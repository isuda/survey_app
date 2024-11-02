import { useEffect } from 'react';
import { useApi } from '../../../../hooks/useApi';

import { Survey } from '../types';

export const useFetchSurvey = () => {
  const { data, loading, error, fetchData } = useApi<Survey[]>('/api/v1/surveys');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { surveys: data, loading, error };
};
