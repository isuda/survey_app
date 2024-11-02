import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SurveyQuestion from '../../../../features/survey/components/SurveyQuestion';

const mockScaleQuestion = {
  id: 1,
  title: 'How are you feeling?',
  type: 'scale',
  min: 1,
  max: 10
};

const mockTextQuestion = {
  id: 2,
  title: 'Describe your day',
  type: 'text',
  limit: 500
};

describe('SurveyQuestion', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders scale question correctly', () => {
    render(
      <SurveyQuestion
        question={mockScaleQuestion}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(mockScaleQuestion.title)).toBeInTheDocument();
    expect(screen.getByRole('slider')).toBeInTheDocument();
  });

  it('renders text question correctly', () => {
    render(
      <SurveyQuestion
        question={mockTextQuestion}
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText(mockTextQuestion.title)).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('handles text input changes', () => {
    render(
      <SurveyQuestion
        question={mockTextQuestion}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Test response' } });

    expect(mockOnChange).toHaveBeenCalledWith(mockTextQuestion.id, 'Test response');
  });
});
