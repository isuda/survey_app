import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ThankYouPage from '../../../../features/result/components/ThankYouPage';

// Mock the hooks
const mockNavigate = jest.fn();
const mockClearUserContext = jest.fn();

// Mock the hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../app/context/UserContext', () => ({
  useUserContext: () => ({
    clearUserContext: mockClearUserContext
  })
}));

describe('ThankYouPage', () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders thank you message', () => {
    render(
      <MemoryRouter>
        <ThankYouPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Thank you for participating!')).toBeInTheDocument();
    expect(screen.getByText('Your responses have been recorded.')).toBeInTheDocument();
  });

  it('renders restart button', () => {
    render(
      <MemoryRouter>
        <ThankYouPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /restart survey/i })).toBeInTheDocument();
  });

  it('handles restart button click correctly', () => {
    render(
      <MemoryRouter>
        <ThankYouPage />
      </MemoryRouter>
    );

    const restartButton = screen.getByRole('button', { name: /restart survey/i });
    fireEvent.click(restartButton);

    expect(mockClearUserContext).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('clears user context and navigates to home on restart', () => {
    render(
      <MemoryRouter>
        <ThankYouPage />
      </MemoryRouter>
    );

    const restartButton = screen.getByRole('button', { name: /restart survey/i });
    fireEvent.click(restartButton);

    // Verify clearing context happens before navigation
    expect(mockClearUserContext.mock.invocationCallOrder[0])
      .toBeLessThan(mockNavigate.mock.invocationCallOrder[0]);
  });
});
