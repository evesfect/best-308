import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingPage from '@/app/shop/browse/new-arrivals/page';

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

describe('New Arrivals Page', () => {
  const mockProducts = [
    {
      _id: '1',
      name: 'New Arrival Test Product',
      description: 'New Arrival Test Description',
      category: 'jacket',
      salePrice: '129.99',
      imageId: 'test-image-id',
      sizes: ['S', 'M', 'L'],
      colors: ['Black', 'White']
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

  it('renders the new arrivals page with products', async () => {
    render(<ShoppingPage />);

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    expect(screen.getByText('New Arrival Test Description')).toBeInTheDocument();
    expect(screen.getByText('Price: $129.99')).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText('Search for products...');
    await user.type(searchInput, 'jacket');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/product', {
        params: expect.objectContaining({
          query: 'jacket',
          newArrivals: true
        })
      });
    });
  });

  it('shows error toast when adding to cart without size/color selection', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Please select a size and color before adding to cart.')).toBeInTheDocument();
  });

  it('successfully adds product to cart for non-logged-in user', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    // Select size and color
    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');
    
    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Black');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);

    expect(screen.getByText('Item added to cart.')).toBeInTheDocument();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Black',
      quantity: 1,
      salePrice: '129.99'
    });
  });

  it('handles adding duplicate items to cart', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    const sizeSelect = screen.getByLabelText('Size');
    const colorSelect = screen.getByLabelText('Color');
    
    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Black');

    const addToCartButton = screen.getByText('Add to Cart');
    await user.click(addToCartButton);
    await user.click(addToCartButton);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Black',
      quantity: 2,
      salePrice: '129.99'
    });
  });

  it('handles filtering by category', async () => {
    await act(async () => {
      render(<ShoppingPage />);
    });
    
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    // Use getByRole with name option
    const categorySelect = screen.getByRole('combobox', { 
      name: 'All Categories' 
    });
    await user.selectOptions(categorySelect, 'jacket');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/product', {
        params: expect.objectContaining({
          category: 'jacket',
          newArrivals: true
        })
      });
    });
  });

  it('handles price sorting', async () => {
    await act(async () => {
      render(<ShoppingPage />);
    });
    
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText('New Arrival Test Product')).toBeInTheDocument();
    });

    // Use getByRole with name option
    const orderSelect = screen.getByRole('combobox', { 
      name: 'Order By' 
    });
    await user.selectOptions(orderSelect, 'asc');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith('/api/product', {
        params: expect.objectContaining({
          order: 'asc',
          newArrivals: true
        })
      });
    });
  });
});