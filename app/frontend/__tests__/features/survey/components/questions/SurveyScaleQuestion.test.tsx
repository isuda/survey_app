import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurveyScaleQuestion from '../../../../../features/survey/components/questions/SurveyScaleQuestion';

const mockQuestion = {
  id: 1,
  title: 'Rate your mood',
  type: 'scale',
  min: 1,
  max: 10
};

describe('SurveyScaleQuestion', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders with default value when no initial value provided', () => {
    render(
      <SurveyScaleQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(mockQuestion.title)).toBeInTheDocument();
    // Default value should be middle of range (5.5 floored to 5)
    expect(screen.getByText('5')).toBeInTheDocument();
  });

  it('renders with provided initial value', () => {
    render(
      <SurveyScaleQuestion
        question={mockQuestion}
        onChange={mockOnChange}
        value={7}
      />
    );

    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'This field is required';
    render(
      <SurveyScaleQuestion
        question={mockQuestion}
        onChange={mockOnChange}
        error={errorMessage}
      />
    );

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('calls onChange when slider value changes', () => {
    render(
      <SurveyScaleQuestion
        question={mockQuestion}
        onChange={mockOnChange}
        value={5}
      />
    );

    const slider = screen.getByRole('slider');
    fireEvent.change(slider, { target: { value: '8' } });

    expect(mockOnChange).toHaveBeenCalledWith(8);
  });

  it('respects min and max constraints', () => {
    render(
      <SurveyScaleQuestion
        question={mockQuestion}
        onChange={mockOnChange}
      />
    );

    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('min', '1');
    expect(slider).toHaveAttribute('max', '10');
  });
});
