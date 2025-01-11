import { GET } from '@/app/api/wishlist/get-users/route';
import Wishlist from '@/models/wishlist.model';
import connectionPromise from '@/lib/mongodb';

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/models/wishlist.model', () => ({
    __esModule: true,
    default: {
        find: jest.fn(() => ({
            select: jest.fn(), // Mock the select method in the chain
        })),
    },
}));

describe('GET /api/wishlist/get-users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return user IDs for a valid product ID', async () => {
        const req = {
            url: 'http://localhost/api/wishlist/get-users?productId=702702702702702702702702',
        } as unknown as Request;

        const mockWishlistItems = [
            { userId: 'user1' },
            { userId: 'user2' },
        ];

        // Mock implementations
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.find as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce(mockWishlistItems),
        });

        const res = await GET(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ userIds: ['user1', 'user2'] });
        expect(Wishlist.find).toHaveBeenCalledWith({
            'items.productId': '702702702702702702702702',
        });
    });

    it('should return 400 if product ID is not provided', async () => {
        const req = {
            url: 'http://localhost/api/wishlist/get-users',
        } as unknown as Request;

        const res = await GET(req);

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
            error: 'Product ID is required',
        });
        expect(Wishlist.find).not.toHaveBeenCalled();
    });

    it('should return 404 if no users are found for the product ID', async () => {
        const req = {
            url: 'http://localhost/api/wishlist/get-users?productId=702702702702702702702702',
        } as unknown as Request;

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.find as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockResolvedValueOnce([]),
        });

        const res = await GET(req);

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({
            message: 'No users found for the provided product ID.',
        });
        expect(Wishlist.find).toHaveBeenCalledWith({
            'items.productId': '702702702702702702702702',
        });
    });

    it('should return 500 if there is an internal server error', async () => {
        const req = {
            url: 'http://localhost/api/wishlist/get-users?productId=702702702702702702702702',
        } as unknown as Request;

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.find as jest.Mock).mockReturnValueOnce({
            select: jest.fn().mockImplementationOnce(() => {
                throw new Error('Database error');
            }),
        });

        const res = await GET(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Failed to fetch wishlist users',
        });
        expect(Wishlist.find).toHaveBeenCalledWith({
            'items.productId': '702702702702702702702702',
        });
    });
});
