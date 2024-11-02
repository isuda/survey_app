const csrfTokenMock = jest.fn()

// Mock the getCsrfToken utility
jest.mock('../../../../../utils/csrfToken', () => ({
  getCsrfToken: csrfTokenMock
}));

import { renderHook, act } from '@testing-library/react';
import { useSubmitSurveyResponse } from '../../../../../features/survey/api/hooks/useSubmitSurveyResponse';

const fetchMock = jest.fn();
const consoleMock = jest.fn();

global.fetch = fetchMock;

// Mock console.error to suppress expected error messages
console.error = consoleMock;


// Mock console.error
const originalConsoleError = console.error;

describe('useSubmitSurveyResponse', () => {
  const mockSurveyId = 1;
  const mockData = {
    email: 'test@example.com',
    responses: [{ question_id: 1, value: 'test response' }]
  };

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    csrfTokenMock.mockReturnValue('mock-csrf-token');
  });

  afterAll(() => {
    // Restore original console.error
    console.error = originalConsoleError;
  });

  it('handles successful submission', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ success: true })
    });

    const { result } = renderHook(() => useSubmitSurveyResponse(mockSurveyId));

    let success;
    await act(async () => {
      success = await result.current.submitResponse(mockData);
    });

    expect(success).toBe(true);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      `/api/v1/surveys/${mockSurveyId}/survey_responses`,
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'mock-csrf-token'
        },
        body: JSON.stringify({
          survey_response: {
            email: mockData.email,
            responses: mockData.responses
          }
        })
      })
    );
  });

  it('handles submission failure', async () => {
    const errorMessage = 'Failed to submit survey responses';
    fetchMock.mockRejectedValueOnce(new Error(errorMessage));

    const { result } = renderHook(() => useSubmitSurveyResponse(mockSurveyId));

    let success;
    await act(async () => {
      success = await result.current.submitResponse(mockData);
    });

    expect(success).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('handles non-ok response', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 422,
      statusText: 'Unprocessable Entity'
    });

    const { result } = renderHook(() => useSubmitSurveyResponse(mockSurveyId));

    let success;
    await act(async () => {
      success = await result.current.submitResponse(mockData);
    });

    expect(success).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to submit survey responses');
  });

  it('sets loading state during submission', async () => {
    fetchMock.mockImplementation(() =>
      new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
    );

    const { result } = renderHook(() => useSubmitSurveyResponse(mockSurveyId));

    let promise;
    await act(async () => {
      promise = result.current.submitResponse(mockData);
    });

    // Check loading state after the state update has been processed
    expect(result.current.loading).toBe(true);

    await act(async () => {
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('handles missing CSRF token', async () => {
    csrfTokenMock.mockReturnValue(null);
    fetchMock.mockResolvedValueOnce({
      ok: true
    });

    const { result } = renderHook(() => useSubmitSurveyResponse(mockSurveyId));

    await act(async () => {
      await result.current.submitResponse(mockData);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          'X-CSRF-Token': ''
        })
      })
    );
  });
});
