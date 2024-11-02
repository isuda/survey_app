import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import EmailPage from '../../../../features/email/components/EmailPage';

const mockNavigate = jest.fn();
const mockSetEmail = jest.fn();

// Mock the hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../../../../app/context/UserContext', () => ({
  useUserContext: () => ({
    setEmail: mockSetEmail
  }),
}));

describe('EmailPage', () => {


  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email input form', () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Mental Health Survey')).toBeInTheDocument();
    expect(screen.getByLabelText('email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /start survey/i })).toBeInTheDocument();
  });

  it('shows error for invalid email', async () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('email address');
    const submitButton = screen.getByRole('button', { name: /start survey/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockSetEmail).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('shows error for empty email', async () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    const submitButton = screen.getByRole('button', { name: /start survey/i });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();
    expect(mockSetEmail).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handles valid email submission correctly', async () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('email address');
    const submitButton = screen.getByRole('button', { name: /start survey/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockSetEmail).toHaveBeenCalledWith('test@example.com');
      expect(mockNavigate).toHaveBeenCalledWith('/survey');
    });
  });

  it('clears error when valid email is entered', async () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('email address');
    const submitButton = screen.getByRole('button', { name: /start survey/i });

    // First enter invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    expect(await screen.findByText('Please enter a valid email address')).toBeInTheDocument();

    // Then enter valid email
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    // Error should be cleared
    expect(screen.queryByText('Please enter a valid email address')).not.toBeInTheDocument();
  });

  it('prevents form submission on enter key with invalid email', () => {
    render(
      <MemoryRouter>
        <EmailPage />
      </MemoryRouter>
    );

    const emailInput = screen.getByLabelText('email address');

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.keyPress(emailInput, { key: 'Enter', code: 13, charCode: 13 });

    expect(mockSetEmail).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
