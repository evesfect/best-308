import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRouter } from 'next/navigation';
import StaticTopBar from '@/components/StaticTopBar';

// Mock next/navigation
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null })
}));

describe('StaticTopBar', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('renders navigation links', () => {
    render(<StaticTopBar />);
    
    expect(screen.getByText('New Arrivals')).toBeInTheDocument();
    expect(screen.getByText('Men')).toBeInTheDocument();
    expect(screen.getByText('Women')).toBeInTheDocument();
    expect(screen.getByText('Best Sellers')).toBeInTheDocument();
  });

  it('navigates to correct routes when links are clicked', async () => {
    render(<StaticTopBar />);
    const user = userEvent.setup();

    // Get all links and verify their href attributes
    const menLink = screen.getByText('Men').closest('a');
    const womenLink = screen.getByText('Women').closest('a');
    const newArrivalsLink = screen.getByText('New Arrivals').closest('a');
    const bestSellersLink = screen.getByText('Best Sellers').closest('a');

    expect(menLink).toHaveAttribute('href', '/shop/browse/men');
    expect(womenLink).toHaveAttribute('href', '/shop/browse/women');
    expect(newArrivalsLink).toHaveAttribute('href', '/shop/browse/new-arrivals');
    expect(bestSellersLink).toHaveAttribute('href', '/shop/browse/best-sellers');
  });
});