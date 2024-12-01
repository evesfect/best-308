import { POST } from '@/app/api/cart/view-cart/route';
import ShoppingCart from '@/models/shopping-cart.model';
import connectionPromise from '@/lib/mongodb';

jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/models/shopping-cart.model', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(() => ({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn(),
        })),
    },
}));

describe('POST /api/cart/view-cart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return local cart and total price when user is not logged in', async () => {
        const localCart = [
            { salePrice: 10, quantity: 2 },
            { salePrice: 20, quantity: 1 },
        ];
        const req = {
            json: jest.fn().mockResolvedValue({ localCart }),
        } as unknown as Request;

        const res = await POST(req);

        const expectedTotalPrice = 40; // 10*2 + 20*1

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            cart: localCart,
            totalPrice: expectedTotalPrice,
        });
    });

    it('should return an empty cart if no cart exists for logged-in user', async () => {
        const userId = 'mockUserId';
        const req = {
            json: jest.fn().mockResolvedValue({ userId, localCart: [] }),
        } as unknown as Request;

        (ShoppingCart.findOne as jest.Mock).mockImplementationOnce(() => ({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce(null), // Simulate no cart found
        }));

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({ cart: [], totalPrice: 0 });
    });

    it('should return a formatted cart and total price for logged-in user with a cart', async () => {
        const userId = 'mockUserId';
        const mockCart = {
            items: [
                {
                    processedProductId: {
                        _id: 'product1',
                        name: 'Product 1',
                        imageId: 'image1',
                        salePrice: 15,
                        size: 'M',
                        color: 'Red',
                    },
                    quantity: 2,
                },
                {
                    processedProductId: {
                        _id: 'product2',
                        name: 'Product 2',
                        imageId: 'image2',
                        salePrice: 25,
                        size: 'L',
                        color: 'Blue',
                    },
                    quantity: 1,
                },
            ],
        };

        const req = {
            json: jest.fn().mockResolvedValue({ userId, localCart: [] }),
        } as unknown as Request;

        (ShoppingCart.findOne as jest.Mock).mockImplementationOnce(() => ({
            populate: jest.fn().mockReturnThis(),
            exec: jest.fn().mockResolvedValueOnce(mockCart),
        }));

        const res = await POST(req);

        const expectedCart = [
            {
                _id: 'product1',
                name: 'Product 1',
                imageId: 'image1',
                salePrice: 15,
                size: 'M',
                color: 'Red',
                quantity: 2,
            },
            {
                _id: 'product2',
                name: 'Product 2',
                imageId: 'image2',
                salePrice: 25,
                size: 'L',
                color: 'Blue',
                quantity: 1,
            },
        ];
        const expectedTotalPrice = 55; // (15*2) + (25*1)

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            cart: expectedCart,
            totalPrice: expectedTotalPrice,
        });
    });

    it('should return 400 if localCart is not an array', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({ localCart: 'invalidCart' }),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: 'Invalid local cart format' });
    });

    it('should return 500 on internal server error', async () => {
        const userId = 'mockUserId';
        const req = {
            json: jest.fn().mockResolvedValue({ userId, localCart: [] }),
        } as unknown as Request;

        (ShoppingCart.findOne as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Failed to retrieve cart',
            details: 'Database error',
        });
    });
});
