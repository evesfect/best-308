import { GET } from '@/app/api/wishlist/view-wishlist/route';
import Wishlist from '@/models/wishlist.model';
import Product from '@/models/product.model';
import connectionPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import { Types } from 'mongoose';

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/models/wishlist.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(() => ({
            lean: jest.fn(), // Mock the `lean` method
        })),
    },
}));

jest.mock('@/models/product.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(() => ({
            lean: jest.fn(), // Mock the `lean` method
        })),
    },
}));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    getServerSession: jest.fn(),
}));

describe('GET /api/wishlist/view-wishlist', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should retrieve the wishlist for a logged-in user without _id in the product', async () => {
        const session = { user: { id: '702702702702702702702702' } };

        const mockWishlist = {
            userId: new Types.ObjectId('702702702702702702702702'),
            items: [
                { _id: '1', productId: '602602602602602602602602', size: 'M', color: 'Red' },
                { _id: '2', productId: '602602602602602602602603', size: 'L', color: 'Blue' },
            ],
        };

        const mockProduct1 = {
            name: 'Product 1',
            description: 'Description 1',
            salePrice: 100,
            imageId: 'image1',
            category: 'Category 1',
            available_stock: 10,
            colors: ['Red', 'Blue'],
            sizes: ['M', 'L'],
        };

        const mockProduct2 = {
            name: 'Product 2',
            description: 'Description 2',
            salePrice: 200,
            imageId: 'image2',
            category: 'Category 2',
            available_stock: 5,
            colors: ['Green', 'Blue'],
            sizes: ['S', 'L'],
        };

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOne as jest.Mock).mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce(mockWishlist),
        });
        (Product.findById as jest.Mock)
            .mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce(mockProduct1),
            })
            .mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce(mockProduct2),
            });

        const req = {} as unknown as Request;
        const res = await GET(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'Wishlist retrieved successfully',
            items: [
                {
                    _id: '1',
                    productId: '602602602602602602602602',
                    product: mockProduct1, // No _id included in product
                    size: 'M',
                    color: 'Red',
                },
                {
                    _id: '2',
                    productId: '602602602602602602602603',
                    product: mockProduct2, // No _id included in product
                    size: 'L',
                    color: 'Blue',
                },
            ],
        });
    });



    it('should return 401 if the user is not logged in', async () => {
        (getServerSession as jest.Mock).mockResolvedValue(null);

        const req = {} as unknown as Request;
        const res = await GET(req);

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return an empty wishlist if no wishlist exists for the user', async () => {
        const session = { user: { id: '702702702702702702702702' } };

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOne as jest.Mock).mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce(null),
        });

        const req = {} as unknown as Request;
        const res = await GET(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'No wishlist found',
            items: [],
        });
    });

    it('should return 500 if there is an internal server error', async () => {
        const session = { user: { id: '702702702702702702702702' } };

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOne as jest.Mock).mockReturnValueOnce({
            lean: jest.fn().mockImplementationOnce(() => {
                throw new Error('Database error');
            }),
        });

        const req = {} as unknown as Request;
        const res = await GET(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Internal server error',
            details: 'Database error',
        });
    });

    it('should filter out null products in the wishlist', async () => {
        const session = { user: { id: '702702702702702702702702' } };

        const mockWishlist = {
            userId: new Types.ObjectId('702702702702702702702702'),
            items: [
                { _id: '1', productId: '602602602602602602602602', size: 'M', color: 'Red' },
                { _id: '2', productId: '602602602602602602602603', size: 'L', color: 'Blue' },
            ],
        };

        const mockProduct1 = {
            name: 'Product 1',
            description: 'Description 1',
            salePrice: 100,
            imageId: 'image1',
            category: 'Category 1',
            available_stock: 10,
            colors: ['Red', 'Blue'],
            sizes: ['M', 'L'],
        };

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOne as jest.Mock).mockReturnValueOnce({
            lean: jest.fn().mockResolvedValueOnce(mockWishlist),
        });
        (Product.findById as jest.Mock)
            .mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce(mockProduct1),
            })
            .mockReturnValueOnce({
                lean: jest.fn().mockResolvedValueOnce(null), // Simulate a missing product
            });

        const req = {} as unknown as Request;
        const res = await GET(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'Wishlist retrieved successfully',
            items: [
                {
                    _id: '1',
                    productId: '602602602602602602602602',
                    product: mockProduct1, // No _id included in product
                    size: 'M',
                    color: 'Red',
                },
            ],
        });
    });
});
