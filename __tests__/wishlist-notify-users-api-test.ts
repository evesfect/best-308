import { POST } from '@/app/api/wishlist/notify-users/route';
import connectionPromise from '@/lib/mongodb';
import Product from '@/models/product.model';
import nodemailer from 'nodemailer';

// Mock modules first, before any mock implementations
jest.mock('@/lib/mongodb', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('@/models/product.model', () => ({
    __esModule: true,
    default: {
        findById: jest.fn(),
    },
}));

jest.mock('nodemailer');

// Then declare mock implementations
const mockSendMail = jest.fn();
const mockCreateTransport = jest.fn(() => ({
    sendMail: mockSendMail,
}));

// Setup nodemailer mock implementation after declaring the mocks
beforeAll(() => {
    // @ts-ignore
    nodemailer.createTransport = mockCreateTransport;
});

describe('POST /api/wishlist/notify-users', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should send discount notification emails to the provided email list', async () => {
        const mockProduct = { _id: '602602602602602602602602', name: 'Mock Product' };
        const mockEmails = ['test1@example.com', 'test2@example.com'];

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockResolvedValueOnce(mockProduct);
        mockSendMail.mockResolvedValue(true); // Simulate successful email sends

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '602602602602602602602602',
                emails: mockEmails,
            }),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(200);
        expect(await res.json()).toEqual({
            message: 'Discount notification emails sent successfully.',
        });

        expect(Product.findById).toHaveBeenCalledWith('602602602602602602602602');
        expect(mockCreateTransport).toHaveBeenCalled();
        expect(mockSendMail).toHaveBeenCalledTimes(mockEmails.length);

        mockEmails.forEach(email => {
            expect(mockSendMail).toHaveBeenCalledWith(
                expect.objectContaining({
                    to: email,
                    subject: 'Product Discount Alert!',
                    html: expect.stringContaining(mockProduct.name),
                })
            );
        });
    });

    it('should return 400 if productId or emails are not provided', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({}),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({
            error: 'Product ID and a list of emails are required',
        });
    });

    it('should return 404 if the product does not exist', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                productId: 'nonExistentProductId',
                emails: ['test@example.com'],
            }),
        } as unknown as Request;

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockResolvedValueOnce(null);

        const res = await POST(req);

        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({
            error: 'Product not found',
        });

        expect(Product.findById).toHaveBeenCalledWith('nonExistentProductId');
    });

    it('should return 500 if sending emails fails', async () => {
        const mockProduct = { _id: '602602602602602602602602', name: 'Mock Product' };
        const mockEmails = ['test1@example.com', 'test2@example.com'];

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockResolvedValueOnce(mockProduct);
        mockSendMail.mockRejectedValueOnce(new Error('Email error'));

        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '602602602602602602602602',
                emails: mockEmails,
            }),
        } as unknown as Request;

        const res = await POST(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Failed to send discount notifications',
        });

        expect(Product.findById).toHaveBeenCalledWith('602602602602602602602602');
        expect(mockSendMail).toHaveBeenCalled();
    });

    it('should return 500 if there is an internal server error', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                productId: '602602602602602602602602',
                emails: ['test@example.com'],
            }),
        } as unknown as Request;

        (connectionPromise as jest.Mock).mockResolvedValueOnce(true);
        (Product.findById as jest.Mock).mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const res = await POST(req);

        expect(res.status).toBe(500);
        expect(await res.json()).toEqual({
            error: 'Failed to send discount notifications',
        });
    });
});