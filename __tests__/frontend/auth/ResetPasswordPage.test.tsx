import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ResetPasswordPage from "@/app/auth/reset-password/page";
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

// Mock the next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(() => ({
    get: (param: string) => {
      if (param === 'token') return 'mock-token';
      if (param === 'email') return 'test@example.com';
      return null;
    }
  }))
}));

// Mock the next-auth/react module
jest.mock('next-auth/react', () => ({
  getSession: jest.fn(),
}));

describe("ResetPasswordPage", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Setup router mock
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush
    }));

    // Setup getSession mock to return a mock session
    (getSession as jest.Mock).mockResolvedValue({
      user: { email: 'test@example.com' },
      error: null
    });

    // Mock fetch globally
    global.fetch = jest.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ message: 'Password reset successful' })
        })
    ) as jest.Mock;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly", () => {
    render(<ResetPasswordPage />);
    const header = screen.getByRole("heading", { name: /reset password/i });
    expect(header).toBeInTheDocument();
  });

  it("displays a success message when the password is reset successfully", async () => {
    render(<ResetPasswordPage />);

    const newPasswordInput = screen.getByLabelText(/new password:/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password:/i);
    const submitButton = screen.getByRole("button", { name: /reset password/i });

    fireEvent.change(newPasswordInput, { target: { value: "password123" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    const successMessage = await screen.findByRole("status", {
      timeout: 4000
    });
    expect(successMessage).toHaveTextContent(/password reset successful/i);

    // Wait for the navigation to occur (after the 3-second timeout)
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/auth/signin");
    }, { timeout: 4000 });
  });
});
