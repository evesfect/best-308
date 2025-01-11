import { DELETE } from '@/app/api/wishlist/remove-from-wishlist/route';
import Wishlist from '@/models/wishlist.model';
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
        findOneAndUpdate: jest.fn(),
    },
}));

jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(),
    getServerSession: jest.fn(),
}));

describe('DELETE /api/wishlist/remove-from-wishlist', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should remove an item from the wishlist for a logged-in user', async () => {
        const session = {
            user: { id: '702702702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702',
            }),
        } as unknown as Request;

        const mockUpdatedWishlist = {
            userId: new Types.ObjectId('702702702702702702702702'),
            items: [], // Updated wishlist without the removed item
        };

        // Mock implementations
        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(mockUpdatedWishlist);

        const res = await DELETE(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'Item removed from wishlist successfully',
            wishlist: mockUpdatedWishlist,
        });
        expect(Wishlist.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: new Types.ObjectId('702702702702702702702702') },
            { $pull: { items: { productId: '702702702702702702702702' } } },
            { new: true }
        );
    });

    it('should return 400 if product ID is not provided', async () => {
        const session = {
            user: { id: '702702702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({}), // No productId in body
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);

        const res = await DELETE(req);

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: 'Product ID is required' });
        expect(Wishlist.findOneAndUpdate).not.toHaveBeenCalled();
    });

    it('should return 401 if the user is not logged in', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702',
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(null);

        const res = await DELETE(req);

        expect(res.status).toBe(401);
        expect(await res.json()).toEqual({ error: 'Unauthorized' });
    });

    it('should return 404 if the wishlist is not found', async () => {
        const session = {
            user: { id: '702702702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702',
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOneAndUpdate as jest.Mock).mockResolvedValueOnce(null);

        const res = await DELETE(req);

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: 'Wishlist not found' });
        expect(Wishlist.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: new Types.ObjectId('702702702702702702702702') },
            { $pull: { items: { productId: '702702702702702702702702' } } },
            { new: true }
        );
    });

    it('should return 500 if there is an internal server error', async () => {
        const session = {
            user: { id: '702702702702702702702702' },
        };

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '702702702702702702702702',
            }),
        } as unknown as Request;

        (getServerSession as jest.Mock).mockResolvedValue(session);
        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Wishlist.findOneAndUpdate as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await DELETE(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({ error: 'Internal server error' });
        expect(Wishlist.findOneAndUpdate).toHaveBeenCalledWith(
            { userId: new Types.ObjectId('702702702702702702702702') },
            { $pull: { items: { productId: '702702702702702702702702' } } },
            { new: true }
        );
    });
});
