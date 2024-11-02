import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SurveyPage from '../../../../features/survey/components/SurveyPage';
import { useSurveyContext } from '../../../../features/survey/context/SurveyContext';
import { useUserContext } from '../../../../app/context/UserContext';
import { useSubmitSurveyResponse } from '../../../../features/survey/api/hooks/useSubmitSurveyResponse';

// Mock the hooks
jest.mock('../../../../features/survey/context/SurveyContext');
jest.mock('../../../../app/context/UserContext');
jest.mock('../../../../features/survey/api/hooks/useSubmitSurveyResponse');

const mockNavigate = jest.fn();
const mockUseParams = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useParams: () => mockUseParams()
}));

describe('SurveyPage', () => {
  const mockSurvey = {
    id: 1,
    name: 'Test Survey',
    questions: [
      { id: 1, title: 'Question 1', type: 'scale', min: 1, max: 10 },
      { id: 2, title: 'Question 2', type: 'text', limit: 500 }
    ]
  };

  const mockResponses = [];
  const mockAddResponse = jest.fn();
  const mockClearResponses = jest.fn();
  const mockSetSurvey = jest.fn();
  const mockSubmitResponse = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseParams.mockReturnValue({ surveyId: '1', questionId: '1' });

    (useSurveyContext as jest.Mock).mockReturnValue({
      survey: mockSurvey,
      responses: mockResponses,
      addResponse: mockAddResponse,
      clearResponses: mockClearResponses,
      setSurvey: mockSetSurvey
    });

    (useUserContext as jest.Mock).mockReturnValue({
      email: 'test@example.com'
    });

    (useSubmitSurveyResponse as jest.Mock).mockReturnValue({
      submitResponse: mockSubmitResponse,
      loading: false,
      error: null
    });
  });

  const renderWithRouter = (component: React.ReactNode) => {
    return render(
      <MemoryRouter initialEntries={['/survey/1/question/1']}>
        <Routes>
          <Route path="/survey/:surveyId/question/:questionId" element={component} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders survey title and first question', () => {
    renderWithRouter(<SurveyPage />);

    expect(screen.getByText(mockSurvey.name)).toBeInTheDocument();
    expect(screen.getByText(mockSurvey.questions[0].title)).toBeInTheDocument();
  });

  it('navigates to root if no survey is present', () => {
    (useSurveyContext as jest.Mock).mockReturnValue({
      survey: null,
      responses: [],
      addResponse: jest.fn(),
      clearResponses: jest.fn()
    });

    renderWithRouter(<SurveyPage />);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('handles next button click correctly', () => {
    renderWithRouter(<SurveyPage />);

    const nextButton = screen.getByLabelText('Next question');
    fireEvent.click(nextButton);

    expect(mockAddResponse).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/survey/1/question/2');
  });

  it('handles previous button click correctly', () => {
    mockUseParams.mockReturnValue({ surveyId: '1', questionId: '2' });

    renderWithRouter(<SurveyPage />);

    const prevButton = screen.getByLabelText('Previous question');
    fireEvent.click(prevButton);

    expect(mockNavigate).toHaveBeenCalledWith('/survey/1/question/1');
  });

  it('disables previous button on first question', () => {
    renderWithRouter(<SurveyPage />);

    const prevButton = screen.getByLabelText('Previous question');
    expect(prevButton).toBeDisabled();
  });

  it('shows submit button on last question', () => {
    mockUseParams.mockReturnValue({ surveyId: '1', questionId: '2' });

    renderWithRouter(<SurveyPage />);

    expect(screen.getByLabelText('Submit survey')).toBeInTheDocument();
  });

  it('handles survey submission correctly', async () => {
    mockSubmitResponse.mockResolvedValue(true);
    mockUseParams.mockReturnValue({ surveyId: '1', questionId: '2' });

    renderWithRouter(<SurveyPage />);

    const submitButton = screen.getByLabelText('Submit survey');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitResponse).toHaveBeenCalledWith({
        email: 'test@example.com',
        responses: mockResponses
      });
      expect(mockClearResponses).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/thank-you');
    });
  });

  it('handles failed submission correctly', async () => {
    mockSubmitResponse.mockResolvedValue(false);
    mockUseParams.mockReturnValue({ surveyId: '1', questionId: '2' });

    renderWithRouter(<SurveyPage />);

    const submitButton = screen.getByLabelText('Submit survey');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSubmitResponse).toHaveBeenCalled();
      expect(mockClearResponses).not.toHaveBeenCalled();
      expect(mockNavigate).not.toHaveBeenCalledWith('/thank-you');
    });
  });

  it('preserves existing responses when navigating', () => {
    const existingResponses = [{ question_id: 1, value: 5 }];
    (useSurveyContext as jest.Mock).mockReturnValue({
      survey: mockSurvey,
      responses: existingResponses,
      addResponse: mockAddResponse,
      clearResponses: mockClearResponses
    });

    renderWithRouter(<SurveyPage />);

    const nextButton = screen.getByLabelText('Next question');
    fireEvent.click(nextButton);

    expect(mockAddResponse).toHaveBeenCalled();
    expect(existingResponses).toHaveLength(1);
  });
});
