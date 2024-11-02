import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SurveyLoader from '../../../../features/survey/components/SurveyLoader';
import { useFetchSurvey } from '../../../../features/survey/api/hooks/useFetchSurvey';

// Mock the hooks
const mockNavigate = jest.fn();
const mockSetSurvey = jest.fn();


jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate
}));

jest.mock('../../../../features/survey/api/hooks/useFetchSurvey', () => ({
  useFetchSurvey: jest.fn()
}));
jest.mock('../../../../features/survey/context/SurveyContext', () => ({
  useSurveyContext: () => ({setSurvey: mockSetSurvey})
}));

describe('SurveyLoader', () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state initially', () => {
    (useFetchSurvey as jest.Mock).mockReturnValue({
      surveys: null,
      loading: true,
      error: null,
    });

    render(
      <MemoryRouter>
        <SurveyLoader />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('navigates to first survey question when surveys are loaded', () => {
    const mockSurveys = [{
      id: 1,
      questions: [{ id: 100 }]
    }];

    (useFetchSurvey as jest.Mock).mockReturnValue({
      surveys: mockSurveys,
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <SurveyLoader />
      </MemoryRouter>
    );

    expect(mockSetSurvey).toHaveBeenCalledWith(mockSurveys[0]);
    expect(mockNavigate).toHaveBeenCalledWith('/survey/1/question/100');
  });

  it('displays error message when fetch fails', () => {
    const errorMessage = 'Failed to load survey';
    (useFetchSurvey as jest.Mock).mockReturnValue({
      surveys: null,
      loading: false,
      error: errorMessage,
    });

    render(
      <MemoryRouter>
        <SurveyLoader />
      </MemoryRouter>
    );

    expect(screen.getByText(`Error loading survey: ${errorMessage}`)).toBeInTheDocument();
  });

  it('does not navigate when no surveys are returned', () => {
    (useFetchSurvey as jest.Mock).mockReturnValue({
      surveys: [],
      loading: false,
      error: null,
    });

    render(
      <MemoryRouter>
        <SurveyLoader />
      </MemoryRouter>
    );

    expect(mockSetSurvey).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
