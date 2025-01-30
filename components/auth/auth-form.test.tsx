import { fireEvent, render, screen, waitFor } from '@/lib/test/test-utils';
import { AuthForm } from './auth-form';

describe('AuthForm', () => {
  it('renders sign in form by default', () => {
    render(<AuthForm />);
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
  });

  it('switches to sign up form', () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByText(/create account/i));
    expect(screen.getByText(/sign up/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<AuthForm />);
    fireEvent.click(screen.getByText(/sign in/i));
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
