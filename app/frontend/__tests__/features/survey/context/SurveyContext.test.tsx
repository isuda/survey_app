import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { SurveyProvider, useSurveyContext } from '../../../../features/survey/context/SurveyContext';

describe('SurveyContext', () => {
  const mockSurvey = {
    id: 1,
    name: 'Test Survey',
    questions: [
      { id: 1, title: 'Question 1', type: 'scale' },
      { id: 2, title: 'Question 2', type: 'text' }
    ]
  };

  const mockResponse = {
    question_id: 1,
    value: 5
  };

  it('provides initial empty state', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SurveyProvider>{children}</SurveyProvider>
    );

    const { result } = renderHook(() => useSurveyContext(), { wrapper });

    expect(result.current.survey).toBeNull();
    expect(result.current.responses).toEqual([]);
  });

  it('sets survey data correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SurveyProvider>{children}</SurveyProvider>
    );

    const { result } = renderHook(() => useSurveyContext(), { wrapper });

    act(() => {
      result.current.setSurvey(mockSurvey);
    });

    expect(result.current.survey).toEqual(mockSurvey);
  });

  it('adds responses correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SurveyProvider>{children}</SurveyProvider>
    );

    const { result } = renderHook(() => useSurveyContext(), { wrapper });

    act(() => {
      result.current.addResponse(mockResponse);
    });

    expect(result.current.responses).toEqual([mockResponse]);
  });

  it('updates existing response for same question', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SurveyProvider>{children}</SurveyProvider>
    );

    const { result } = renderHook(() => useSurveyContext(), { wrapper });

    act(() => {
      result.current.addResponse(mockResponse);
      result.current.addResponse({ ...mockResponse, value: 7 });
    });

    expect(result.current.responses).toHaveLength(1);
    expect(result.current.responses[0].value).toBe(7);
  });

  it('clears responses correctly', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <SurveyProvider>{children}</SurveyProvider>
    );

    const { result } = renderHook(() => useSurveyContext(), { wrapper });

    act(() => {
      result.current.addResponse(mockResponse);
      result.current.clearResponses();
    });

    expect(result.current.responses).toEqual([]);
  });
});
