import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForgotPasswordPage from '@/app/auth/forgot-password/page';

// Mock the fetch API globally
global.fetch = jest.fn();

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the forgot password page correctly', () => {
    render(<ForgotPasswordPage />);

    // Check if the page header is displayed
    expect(screen.getByText('Forgot Password')).toBeInTheDocument();
    // Ensure the email input field is present
    expect(screen.getByLabelText('Email Address:')).toBeInTheDocument();
    // Ensure the submit button is displayed
    expect(screen.getByRole('button', { name: /send recovery email/i })).toBeInTheDocument();
  });

  it('updates the email input field correctly', () => {
    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address:') as HTMLInputElement;

    // Simulate typing into the email input
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('displays a success message when the recovery email is sent successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /send recovery email/i });
    fireEvent.click(submitButton);

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText('Recovery email sent. Please check your inbox.')).toBeInTheDocument();
    });
  });

  it('displays an error message when the recovery email fails to send', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({ message: 'Failed to send recovery email.' }),
    });

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /send recovery email/i });
    fireEvent.click(submitButton);

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to send recovery email.')).toBeInTheDocument();
    });
  });

  it('displays a generic error message when no specific error message is provided', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: jest.fn().mockResolvedValue({}),
    });

    render(<ForgotPasswordPage />);

    const emailInput = screen.getByLabelText('Email Address:');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByRole('button', { name: /send recovery email/i });
    fireEvent.click(submitButton);

    // Wait for the generic error message to appear
    await waitFor(() => {
      expect(screen.getByText('Failed to send recovery email.')).toBeInTheDocument();
    });
  });
});
