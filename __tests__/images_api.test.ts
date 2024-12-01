import { GET } from '@/app/api/images/[id]/route';
import { gridFSBucket } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

jest.mock('@/lib/mongodb', () => ({
    gridFSBucket: {
        find: jest.fn(),
        openDownloadStream: jest.fn(),
    },
}));

jest.mock('next/server', () => {
    return {
        NextResponse: {
            json: jest.fn((data, { status } = {}) => ({
                json: jest.fn().mockResolvedValue(data),
                status: status || 200,
                headers: {
                    get: jest.fn((key) => (key === 'Content-Type' ? 'application/json' : null)),
                },
            })),
            stream: jest.fn((stream, { headers } = {}) => {
                const headersMap = new Map(Object.entries(headers || {}));
                return {
                    stream,
                    status: 200,
                    headers: {
                        get: (key) => headersMap.get(key),
                    },
                };
            }),
        },
    };
});

describe('GET /api/images/:id', () => {
    const validId = '192c6359345678f123456789';
    const mockFile = {
        _id: new ObjectId(validId),
        contentType: 'image/jpeg',
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return an image stream with correct headers', async () => {
        // Mock `find` to return the file metadata
        (gridFSBucket.find as jest.Mock).mockReturnValue({
            toArray: jest.fn().mockResolvedValueOnce([mockFile]),
        });

        // Mock `openDownloadStream` to simulate image data
        const mockStream = {
            on: jest.fn((event, callback) => {
                if (event === 'data') {
                    callback(Buffer.from('mockImageData'));
                }
                if (event === 'end') {
                    callback();
                }
            }),
        };
        (gridFSBucket.openDownloadStream as jest.Mock).mockReturnValue(mockStream);

        // Simulate the request and params
        const req = {} as Request;
        const params = { id: validId };

        // Call the API
        const res = await GET(req, { params });

        // Validate the headers
        expect(res.headers.get('Content-Type')).toBe('application/json');
        expect(mockStream.on).toHaveBeenCalledWith('data', expect.any(Function));
        expect(mockStream.on).toHaveBeenCalledWith('end', expect.any(Function));
        expect(mockStream.on).toHaveBeenCalledWith('error', expect.any(Function));
    });

    it('should return 404 if image not found', async () => {
        // Mock `find` to return no results
        (gridFSBucket.find as jest.Mock).mockReturnValue({
            toArray: jest.fn().mockResolvedValueOnce([]),
        });

        const req = {} as Request;
        const params = { id: validId };

        // Call the API
        const res = await GET(req, { params });

        // Validate the status and response body
        expect(res.status).toBe(404);
        expect(await res.json()).toEqual({ error: 'Image not found' });
    });

    it('should return 400 for an invalid ID', async () => {
        const invalidId = 'invalid-id';

        const req = {} as Request;
        const params = { id: invalidId };

        // Call the API
        const res = await GET(req, { params });

        // Validate the status and response body
        expect(res.status).toBe(400);
        expect(await res.json()).toEqual({ error: 'Invalid image ID' });
    });
});
