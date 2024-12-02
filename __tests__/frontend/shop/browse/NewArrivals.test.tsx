import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import ShoppingPage from '@/app/shop/browse/new-arrivals/page';

// Mock next-auth/react
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null })),
}));

// Mock axios
jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

// Mock next/navigation (Next.js router)
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    prefetch: jest.fn(), // Mock prefetch to avoid errors if it’s called
  })),
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} alt="mocked image" />,
}));

const originalLocation = window.location;

beforeAll(() => {
  delete (window as any).location;
  (window as any).location = {
    ...originalLocation,
    assign: jest.fn(),
    replace: jest.fn(),
    href: '', // Fully mock href as well
    reload: jest.fn(),
  };
});

afterAll(() => {
  (window as any).location = originalLocation;
});

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
      colors: ['Black', 'White'],
    },
  ];

  beforeEach(() => {
    mockAxios.get.mockReset();
    localStorage.clear();
    mockAxios.get.mockResolvedValue({
      status: 200,
      data: mockProducts,
    });
  });

  it('renders the new arrivals page with products', async () => {
    render(<ShoppingPage />);
    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/New Arrival Test Description/i)).toBeInTheDocument();
    expect(screen.getByText(/Price: \$129.99/i)).toBeInTheDocument();
  });

  it('handles search functionality', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    const searchInput = screen.getByPlaceholderText(/Search for products/i);
    await user.type(searchInput, 'jacket');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(expect.any(String), {
        params: expect.objectContaining({
          query: 'jacket',
          newArrivals: true,
        }),
      });
    });
  });

  it('shows error toast when adding to cart without size/color selection', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    const addToCartButton = screen.getByText(/Add to Cart/i);
    await user.click(addToCartButton);

    expect(screen.getByText(/Please select a size and color before adding to cart/i)).toBeInTheDocument();
  });

  it('successfully adds product to cart for non-logged-in user', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    const sizeSelect = screen.getByLabelText(/Size/i);
    const colorSelect = screen.getByLabelText(/Color/i);

    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Black');

    const addToCartButton = screen.getByText(/Add to Cart/i);
    await user.click(addToCartButton);

    expect(screen.getByText(/Item added to cart/i)).toBeInTheDocument();

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Black',
      quantity: 1,
      salePrice: '129.99',
    });
  });

  it('handles adding duplicate items to cart', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    const sizeSelect = screen.getByLabelText(/Size/i);
    const colorSelect = screen.getByLabelText(/Color/i);

    await user.selectOptions(sizeSelect, 'S');
    await user.selectOptions(colorSelect, 'Black');

    const addToCartButton = screen.getByText(/Add to Cart/i);
    await user.click(addToCartButton);
    await user.click(addToCartButton);

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    expect(cart).toHaveLength(1);
    expect(cart[0]).toMatchObject({
      productId: '1',
      size: 'S',
      color: 'Black',
      quantity: 2,
      salePrice: '129.99',
    });
  });

  it('handles filtering by category', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    const categorySelect = screen.getByRole('combobox', { name: /All Categories/i });
    await user.selectOptions(categorySelect, 'jacket');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(expect.any(String), {
        params: expect.objectContaining({
          category: 'jacket',
          newArrivals: true,
        }),
      });
    });
  });

  it('handles price sorting', async () => {
    render(<ShoppingPage />);
    const user = userEvent.setup();

    await waitFor(() => {
      expect(screen.getByText(/New Arrival Test Product/i)).toBeInTheDocument();
    });

    const orderSelect = screen.getByRole('combobox', { name: /Order By/i });
    await user.selectOptions(orderSelect, 'asc');

    await waitFor(() => {
      expect(mockAxios.get).toHaveBeenCalledWith(expect.any(String), {
        params: expect.objectContaining({
          order: 'asc',
          newArrivals: true,
        }),
      });
    });
  });
});
