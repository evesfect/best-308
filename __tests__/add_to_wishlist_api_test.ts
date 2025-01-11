import { POST } from '@/app/api/wishlist/add-to-wishlist/route';
import Wishlist from '@/models/wishlist.model';
import Product from '@/models/product.model';
import connectionPromise from '@/lib/mongodb';
import { getServerSession } from 'next-auth';
import {Types} from "mongoose";

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/models/wishlist.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('@/models/product.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(() => ({
            lean: jest.fn().mockResolvedValue(null), // Default behavior for `.lean()`
        })),
    },
}));


jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(), // Mock default export
    getServerSession: jest.fn(),
}));


describe('POST /api/add-to-wishlist', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should add a new product to the wishlist for a logged-in user', async () => {
        const session = {
            user: { id: '702702702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702', // Hex string
                color: 'Red',
                size: 'M',
            }),
        } as unknown as Request;

        const mockProduct = { _id: new Types.ObjectId('702702702702702702702702'), name: 'Mock Product' };

        // Simulate an empty wishlist (no duplicate items)
        const mockWishlist = {
            userId: new Types.ObjectId('702702702702702702702702'),
            items: [], // No existing items in the wishlist
            save: jest.fn(),
        };

        // Mock implementations
        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockImplementationOnce(() => ({
            lean: jest.fn().mockResolvedValue(mockProduct),
        }));
        (Wishlist.findOne as jest.Mock).mockResolvedValueOnce(mockWishlist);

        const res = await POST(req);

        console.log(res);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'Product added to wishlist',
            wishlist: mockWishlist,
        });

        expect(mockWishlist.items).toHaveLength(1);
        expect(mockWishlist.items[0]).toEqual({
            productId: new Types.ObjectId('702702702702702702702702'),
            color: 'Red',
            size: 'M',
        });

        expect(mockWishlist.save).toHaveBeenCalled();
    });

    it('should return 400 if product ID is not provided', async () => {
        const session = {
            user: { id: '702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                color: 'Red',
                size: 'M',
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);

        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
            error: 'Product ID is required',
            received: { productId: undefined, color: 'Red', size: 'M' },
        });
    });

    it('should return 404 if the product does not exist', async () => {
        const session = {
            user: { id: '702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: 'nonExistentProductId',
                color: 'Red',
                size: 'M',
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (Product.findById as jest.Mock).mockImplementationOnce(() => ({
            lean: jest.fn().mockResolvedValue(null),
        }));

        const res = await POST(req);

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: 'Product not found' });
    });

    it('should return 400 if the item already exists in the wishlist', async () => {
        const session = {
            user: { id: '702702702702702702702702' }, // Valid ObjectId as string
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702', // Valid ObjectId as string
                color: 'Red',
                size: 'M',
            }),
        } as unknown as Request;

        // Mock a product
        const mockProduct = {
            _id: new Types.ObjectId('702702702702702702702702'),
            name: 'Mock Product',
        };

        // Mock a wishlist that already contains the product
        const mockWishlist = {
            userId: new Types.ObjectId('702702702702702702702702'),
            items: [
                {
                    productId: new Types.ObjectId('702702702702702702702702'),
                    color: 'Red',
                    size: 'M',
                },
            ],
        };

        // Mocking
        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockImplementationOnce(() => ({
            lean: jest.fn().mockResolvedValue(mockProduct),
        }));
        (Wishlist.findOne as jest.Mock).mockResolvedValueOnce(mockWishlist);

        // Call the API handler
        const res = await POST(req);

        // Validate response
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
            error: 'This item is already in your wishlist',
        });

        // Validate that no new items were added to the wishlist
        expect(mockWishlist.items).toHaveLength(1);
        expect(mockWishlist.items[0]).toEqual({
            productId: new Types.ObjectId('702702702702702702702702'),
            color: 'Red',
            size: 'M',
        });
    });


    it('should return 401 if the user is not logged in', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                productId: new Types.ObjectId('702702702702702702702702'),
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(null);

        const res = await POST(req);

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return 500 on internal server error', async () => {
        const session = {
            user: { id: '702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: new Types.ObjectId('702702702702702702702702'),
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (Product.findById as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Internal server error',
            details: 'Database error',
        });
    });
});
