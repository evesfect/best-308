import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingPage from '@/app/shop/browse/best-sellers/page';

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

describe('Best Sellers Page', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Test Product',
      description: 'Test Description',
      category: 'Test Category',
      salePrice: '99.99',
      imageId: 'test-image-id',
      sizes: ['S', 'M', 'L'],
      colors: ['Red', 'Blue']
    }
  ];

  const mockCategories = [
    { _id: '1', name: 'Test Category' }
  ];

  beforeEach(() => {
    // Reset all mocks before each test
    mockAxios.get.mockReset();
    localStorage.clear();
  });

  it('renders the shopping page with products', async () => {
    // Mock API responses
    mockAxios.get.mockImplementation((url) => {
      if (url === '/api/product') {
        return Promise.resolve({ data: mockProducts });
      }
      if (url === '/api/product/category') {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<ShoppingPage />);

    // Wait for products to load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Check if product details are rendered
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    expect(screen.getByText('Price: $99.99')).toBeInTheDocument();
  });

  it('handles product filtering', async () => {
    mockAxios.get.mockImplementation((url) => {
      if (url === '/api/product') {
        return Promise.resolve({ data: mockProducts });
      }
      if (url === '/api/product/category') {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<ShoppingPage />);
    const user = userEvent.setup();

    // Test search functionality
    const searchInput = screen.getByPlaceholderText('Search for products...');
    await user.type(searchInput, 'Test');

    // Verify that the API was called with search parameters
    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/product', {
        params: expect.objectContaining({
          query: 'Test',
          bestSellers: true
        })
      });
    });
  });

  it('handles adding products to cart for non-logged-in users', async () => {
    mockAxios.get.mockImplementation((url) => {
      if (url === '/api/product') {
        return Promise.resolve({ data: mockProducts });
      }
      if (url === '/api/product/category') {
        return Promise.resolve({ data: mockCategories });
      }
      return Promise.reject(new Error('Not found'));
    });

    render(<ShoppingPage />);
    const user = userEvent.setup();

    // Wait for product to be rendered
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Select size and color
    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');
    
    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Red');

    // Click add to cart
    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    // Verify toast message
    expect(screen.getByText('Item added to cart.')).toBeInTheDocument();

    // Verify localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Red',
      quantity: 1
    });
  });
}); 