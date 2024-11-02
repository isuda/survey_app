import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SurveyRoutes from '../../../../features/survey/routes/SurveyRoutes';
import * as SurveyContext from '../../../../features/survey/context/SurveyContext';

// Mock the components that are rendered by the routes
jest.mock('../../../../features/survey/components/SurveyLoader', () => {
  return function MockSurveyLoader() {
    return <div data-testid="survey-loader">Survey Loader</div>;
  };
});

jest.mock('../../../../features/survey/components/SurveyPage', () => {
  return function MockSurveyPage() {
    return <div data-testid="survey-page">Survey Page</div>;
  };
});

describe('SurveyRoutes', () => {
  const mockUseSurveyContext = {
    survey: null,
    responses: [],
    setSurvey: jest.fn(),
    addResponse: jest.fn(),
    clearResponses: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(SurveyContext, 'useSurveyContext').mockImplementation(() => mockUseSurveyContext);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SurveyLoader at root path', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <SurveyRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('survey-loader')).toBeInTheDocument();
  });

  it('renders SurveyPage for question route', () => {
    render(
      <MemoryRouter initialEntries={['/1/question/1']}>
        <SurveyRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('survey-page')).toBeInTheDocument();
  });

  it('redirects unknown routes to root', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <SurveyRoutes />
      </MemoryRouter>
    );

    expect(screen.getByTestId('survey-loader')).toBeInTheDocument();
  });
});
