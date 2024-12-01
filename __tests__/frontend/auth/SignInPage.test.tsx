import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import SignInPage from '@/app/auth/signin/page';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn()
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn()
}));

describe('SignInPage', () => {
  const mockPush = jest.fn();
  const mockGet = jest.fn();

  beforeEach(() => {
    // Setup router mock
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }));

    // Setup searchParams mock
    (useSearchParams as jest.Mock).mockImplementation(() => ({
      get: mockGet
    }));

    // Clear mocks
    jest.clearAllMocks();
  });

  it('renders sign in form', () => {
    render(<SignInPage />);
    
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    render(<SignInPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    
    fireEvent.click(submitButton);

    // Wait for the error message to appear without using act
    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Please fill in both email and password fields.');
  });

  it('handles successful sign in', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: null,
      url: '/'
    });

    render(<SignInPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/password:/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        redirect: false,
        email: 'test@example.com',
        password: 'password123',
        callbackUrl: '/'
      });
    });
  });

  it('handles sign in error', async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({
      error: 'INCORRECT_PASSWORD',
      url: null
    });

    render(<SignInPage />);

    // Fill in the form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });

    // Submit the form
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('The password you entered is incorrect. Please try again.')).toBeInTheDocument();
    });
  });

  it('navigates to sign up page', () => {
    render(<SignInPage />);
    
    const signUpButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(signUpButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/signup');
  });

  it('navigates to forgot password page', () => {
    render(<SignInPage />);
    
    const forgotPasswordButton = screen.getByRole('button', { name: /forgot your password/i });
    fireEvent.click(forgotPasswordButton);

    expect(mockPush).toHaveBeenCalledWith('/auth/forgot-password');
  });

  it('shows alert when login_required message is present', () => {
    const mockAlert = jest.spyOn(window, 'alert').mockImplementation(() => {});
    mockGet.mockReturnValue('login_required');

    render(<SignInPage />);

    expect(mockAlert).toHaveBeenCalledWith('You need to log in to access this page.');
    mockAlert.mockRestore();
  });
}); 