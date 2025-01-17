import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingPage from '@/app/shop/browse/women/page';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: () => ({ data: null }),
}));

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}));

describe('Women Shopping Page', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Women Test Product',
      description: 'Women Test Description',
      category: 'dress',
      salePrice: '79.99',
      imageId: 'test-image-id',
      sizes: ['S', 'M', 'L'],
      colors: ['Red', 'Green'],
      available_stock: { S: 10, M: 5, L: 0 }, // Add this field
      total_stock: { S: 20, M: 10, L: 5 },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    mockAxios.get.mockImplementation((url, config) => {
      if (url === '/api/product' && config?.params?.query === 'dress' && config?.params?.sex === 'female') {
        return Promise.resolve({
          status: 200,
          data: mockProducts, // Return filtered mock products
        });
      }
      if (url === '/api/product') {
        return Promise.resolve({
          status: 200,
          data: mockProducts, // Default products
        });
      }
      return Promise.reject(new Error('Unexpected API call'));
    });
  });

  it('renders the women shopping page with products', async () => {
    render(<ShoppingPage />);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Women Test Product/i })).toBeInTheDocument();
    });

    expect(screen.getByText('Women Test Description')).toBeInTheDocument();
    expect(screen.getByText('Price: $79.99')).toBeInTheDocument();
  });

  it('shows error toast when adding to cart without size/color selection', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Women Test Product/i })).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Please select a size and color before adding to cart.')).toBeInTheDocument();
  });

  it('successfully adds product to cart for non-logged-in user', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Women Test Product/i })).toBeInTheDocument();
    });

    // Select size and color
    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');

    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Red');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Item added to cart.')).toBeInTheDocument();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Red',
      quantity: 1,
      salePrice: '79.99',
    });
  });

  it('handles adding duplicate items to cart', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Women Test Product/i })).toBeInTheDocument();
    });

    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');

    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Red');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    await user.click(addToCartButton);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Red',
      quantity: 2,
      salePrice: '79.99',
    });
  });
});