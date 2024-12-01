
// MenPage.test.tsx

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingPage from '@/app/shop/browse/men/page';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null })
}));

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn()
  })
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />
}));

describe('Men Shopping Page', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Men Test Product',
      description: 'Men Test Description',
      category: 'shirt',
      salePrice: '89.99',
      imageId: 'test-image-id',
      sizes: ['S', 'M', 'L'],
      colors: ['Blue', 'Black']
    }
  ];

  beforeEach(() => {
    mockAxios.get.mockReset();
    localStorage.clear();
    mockAxios.get.mockResolvedValue({ 
      status: 200,
      data: mockProducts 
    });
  });

  it('renders the men shopping page with products', async () => {
    render(<ShoppingPage />);

    await waitFor(() => {
      expect(screen.getByText('Men Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('Men Test Description')).toBeInTheDocument();
    expect(screen.getByText('Price: $89.99')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText('Search for products...');
    await user.type(searchInput, 'shirt');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/product', {
        params: expect.objectContaining({
          query: 'shirt',
          sex: 'male'
        })
      });
    });
  });

  it('shows error toast when adding to cart without size/color selection', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Men Test Product')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Please select a size and color before adding to cart.')).toBeInTheDocument();
  });

  it('successfully adds product to cart for non-logged-in user', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Men Test Product')).toBeInTheDocument();
    });

    // Select size and color
    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');
    
    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Blue');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Item added to cart.')).toBeInTheDocument();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Blue',
      quantity: 1,
      salePrice: '89.99'
    });
  });

  it('handles adding duplicate items to cart', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('Men Test Product')).toBeInTheDocument();
    });

    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');
    
    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Blue');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    await user.click(addToCartButton);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Blue',
      quantity: 2,
      salePrice: '89.99'
    });
  });
}); 