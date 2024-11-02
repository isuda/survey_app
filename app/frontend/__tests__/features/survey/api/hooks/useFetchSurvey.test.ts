// Mocking needs to come before the imports in this case
const mockFetchData = jest.fn();
const mockUseApi = jest.fn().mockReturnValue({
  data: null,
  loading: false,
  error: null,
  fetchData: mockFetchData
});

// Mock the useApi hook
jest.mock('../../../../../hooks/useApi', () => ({
  useApi: mockUseApi
}));

import { renderHook } from '@testing-library/react';
import { useFetchSurvey } from '../../../../../features/survey/api/hooks/useFetchSurvey';

describe('useFetchSurvey', () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls fetchData on mount', () => {
    renderHook(() => useFetchSurvey());
    expect(mockFetchData).toHaveBeenCalledTimes(1);
  });

  it('returns loading state', () => {
    mockUseApi.mockReturnValue({
      data: null,
      loading: true,
      error: null,
      fetchData: mockFetchData
    });

    const { result } = renderHook(() => useFetchSurvey());
    expect(result.current.loading).toBe(true);
  });

  it('returns survey data when fetch succeeds', () => {
    const mockSurveys = [
      { id: 1, name: 'Test Survey', questions: [] }
    ];

    mockUseApi.mockReturnValue({
      data: mockSurveys,
      loading: false,
      error: null,
      fetchData: mockFetchData
    });

    const { result } = renderHook(() => useFetchSurvey());
    expect(result.current.surveys).toEqual(mockSurveys);
  });

  it('returns error when fetch fails', () => {
    const errorMessage = 'Failed to fetch surveys';

    mockUseApi.mockReturnValue({
      data: null,
      loading: false,
      error: errorMessage,
      fetchData: mockFetchData
    });

    const { result } = renderHook(() => useFetchSurvey());
    expect(result.current.error).toBe(errorMessage);
  });

  it('initializes useApi with correct URL', () => {
    renderHook(() => useFetchSurvey());
    expect(mockUseApi).toHaveBeenCalledWith('/api/v1/surveys');
  });
});
