import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SignUpPage from '@/app/auth/signup/page';
import { useRouter } from 'next/navigation';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('SignUpPage', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Setup router mock
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }));

    // Reset mocks
    jest.clearAllMocks();
  });

  it('renders signup form', () => {
    render(<SignUpPage />);
    
    expect(screen.getByRole('heading', { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows error when submitting empty form', async () => {
    render(<SignUpPage />);
    
    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Please fill in all fields.');
  });

  it('shows error when passwords do not match', async () => {
    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'DifferentPassword123!' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent("Passwords don't match.");
  });

  it('shows error for invalid email format', async () => {
    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);

    fireEvent.change(emailInput, { target: { value: 'invalidemail' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent('Invalid email format.');
  });

  it('shows error for invalid password format', async () => {
    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'weak' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'weak' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    const errorMessage = await screen.findByRole('alert');
    expect(errorMessage).toHaveTextContent(/Password must be at least 8 characters/);
  });

  it('handles successful signup', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Signup successful' })
      })
    ) as jest.Mock;

    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/auth/signin');
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!',
        username: 'test@example.com'
      }),
      headers: { 'Content-Type': 'application/json' }
    });
  });

  it('handles signup error', async () => {
    const errorMessage = 'Email already exists';
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ message: errorMessage })
      })
    ) as jest.Mock;

    render(<SignUpPage />);

    const emailInput = screen.getByLabelText(/email:/i);
    const passwordInput = screen.getByLabelText(/^password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });

    const submitButton = screen.getByRole('button', { name: /sign up/i });
    fireEvent.click(submitButton);

    const error = await screen.findByRole('alert');
    expect(error).toHaveTextContent(errorMessage);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });
}); 