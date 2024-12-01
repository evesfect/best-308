import '@testing-library/jest-dom';
import { ReadableStream } from 'node:stream/web';
import { TextEncoder, TextDecoder } from 'util';

global.ReadableStream = ReadableStream;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Next.js server utilities
jest.mock('next/server', () => {
    return {
        NextResponse: {
            json: jest.fn((data, { status } = {}) => ({
                json: jest.fn().mockResolvedValue(data),
                status: status || 200,
                headers: {
                    get: (key) => (key === 'Content-Type' ? 'application/json' : null),
                },
            })),
            stream: jest.fn((stream, { headers } = {}) => ({
                stream,
                status: 200,
                headers: {
                    get: (key) => headers[key] || null,
                },
            })),
        },
    };
});

// Mock global Request for backend tests
global.Request = jest.fn().mockImplementation((input, init) => ({
    method: init?.method || 'GET',
    headers: init?.headers || {},
    body: init?.body || null,
    url: input,
    json: jest.fn().mockResolvedValue(JSON.parse(init?.body || '{}')),
}));
