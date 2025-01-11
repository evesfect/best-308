import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingCartPage from '@/app/shop/cart/page';

// Mock next-auth
jest.mock('next-auth/react', () => ({
  useSession: () => ({
    data: null,
    status: 'unauthenticated'
  })
}));

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Create a mock router
const mockRouter = {
  push: jest.fn(),
  back: jest.fn(),
  forward: jest.fn()
};

// Update the mock implementation
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('Shopping Cart Page', () => {
  const mockCartItems = [
    {
      _id: '1',
      name: 'Test Product',
      salePrice: '99.99',
      quantity: 1,
      imageId: 'test-image-1',
      size: 'M',
      color: 'Blue'
    }
  ];

  beforeEach(() => {
    localStorage.clear();
    mockAxios.post.mockReset();
    mockRouter.push.mockReset();  // Reset router mock
    mockAxios.post.mockResolvedValue({
      status: 200,
      data: { cart: mockCartItems }
    });
  });

  it('renders empty cart message when no items', async () => {
    mockAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { cart: [] }
    });

    await act(async () => {
      render(<ShoppingCartPage />);
    });

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders cart items and calculates total price', async () => {
    await act(async () => {
      render(<ShoppingCartPage />);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
      expect(screen.getByText('Price: $99.99')).toBeInTheDocument();
      expect(screen.getByText('Size: M')).toBeInTheDocument();
      expect(screen.getByText('Color: Blue')).toBeInTheDocument();
      expect(
          screen.getByText((content, element) => {
            return (
                content.startsWith('Total Price:') &&
                element?.querySelector('span')?.textContent === '$99.99'
            );
          })
      ).toBeInTheDocument();
    });
  });

  it('handles quantity updates for non-logged-in users', async () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    
    await act(async () => {
      render(<ShoppingCartPage />);
    });

    const user = userEvent.setup();
    const increaseButton = screen.getByText('+');
    
    await user.click(increaseButton);

    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(localCart[0].quantity).toBe(2);
    expect(screen.getByText('Quantity updated in local cart.')).toBeInTheDocument();
  });

  it('prevents negative quantities', async () => {
    localStorage.setItem('cart', JSON.stringify(mockCartItems));
    
    await act(async () => {
      render(<ShoppingCartPage />);
    });

    const user = userEvent.setup();
    const decreaseButton = screen.getByText('-');
    
    // Try to decrease below 0
    await user.click(decreaseButton);
    await user.click(decreaseButton);

    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(localCart).toHaveLength(0); // Item should be removed when quantity reaches 0
  });

  it('redirects to login when non-logged-in user clicks Order Now', async () => {
    await act(async () => {
      render(<ShoppingCartPage />);
    });

    const user = userEvent.setup();
    const orderButton = screen.getByText('Order Now');
    
    await user.click(orderButton);

    expect(mockRouter.push).toHaveBeenCalledWith('/auth/signin?redirect=/shop/cart');
  });

  // Test for logged-in user scenario
  it('handles cart operations for logged-in users', async () => {
    // Mock logged-in session
    jest.spyOn(require('next-auth/react'), 'useSession').mockImplementation(() => ({
      data: { user: { id: 'test-user-id' } },
      status: 'authenticated'
    }));

    mockAxios.post.mockResolvedValueOnce({
      status: 200,
      data: { cart: mockCartItems }
    });

    await act(async () => {
      render(<ShoppingCartPage />);
    });

    await waitFor(() => {
      expect(mockAxios.post).toHaveBeenCalledWith('/api/cart/view-cart', {
        userId: 'test-user-id',
        localCart: []
      });
    });
  });
}); 