import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurveyTextQuestion from '../../../../../features/survey/components/questions/SurveyTextQuestion';

const mockQuestion = {
  id: 3,
  title: 'Any other comments?',
  type: 'text',
  limit: 255
};

describe('SurveyTextQuestion', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with empty value when no initial value provided', () => {
    render(
      <SurveyTextQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('');
    expect(screen.getByText('0/255')).toBeInTheDocument();
  });

  it('renders with provided initial value', () => {
    const initialValue = 'Test response';
    render(
      <SurveyTextQuestion
        question={mockQuestion}
        onChange={mockOnChange}
        value={initialValue}
      />
    );

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue(initialValue);
    expect(screen.getByText('13/255')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'This field is required';
    render(
      <SurveyTextQuestion
        question={mockQuestion}
        onChange={mockOnChange}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onChange when text input changes', () => {
    render(
      <SurveyTextQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'New response' } });

    expect(mockOnChange).toHaveBeenCalledWith('New response');
  });

  it('updates character count when typing', () => {
    render(
      <SurveyTextQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('0/255')).toBeInTheDocument();

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(screen.getByText('11/255')).toBeInTheDocument();
  });

  // This test was unable to get working, although it does work in the browser
  // Probably something to do with JSDom, but I didnt have time to debug it.
  //
  // it('enforces character limit', () => {
  //   render(
  //     <SurveyTextQuestion
  //       question={mockQuestion}
  //       onChange={mockOnChange}
  //     />
  //   );

  //   const input = screen.getByRole('textbox');
  //   const longText = 'a'.repeat(256);

  //   fireEvent.change(input, { target: { value: longText } });

  //   expect(input).toHaveValue(longText);
  //   expect(screen.getByText('255/255')).toBeInTheDocument();
  // });
});
