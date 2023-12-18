import { Request, Response } from 'express';
import { addClient, sendToAllClients, sendToSpecificClient, setClients } from './SSEServer';
import { clientsMock, resetMocks } from '../../__mocks__/clientsMock';

/**
 * Represents a mock client object.
 * @interface
 */
interface MockClient {
    id: number;
    userId: string;
    res: Response;
}

/**
 * Resets mock data before each test.
 */
beforeEach(() => {
    resetMocks();
    setClients(clientsMock);
});

let closeCallback: () => void = () => { };

/**
 * Creates a mock request object.
 * @returns {Request} The mock request object.
 */
const createMockRequest = (): Request => {
    const req: Partial<Request> = {
        on: jest.fn().mockImplementationOnce((event: string, callback: () => void) => {
            if (event === 'close') {
                closeCallback = callback;
            }
            return req as Request;
        }),
    };

    return req as Request;
};

/**
 * Triggers a mock close event for testing.
 */
export const triggerCloseEvent = () => {
    closeCallback();
};

describe('sseController', () => {
    /**
     * Test if addClient adds a client.
     */
    test('addClient adds a client', () => {
        const mockReq = {
            on: jest.fn(),
            query: {
                userId: 'user1'
            },
        } as unknown as Request;

        const mockRes = {
            writeHead: jest.fn(),
            write: jest.fn()
        } as unknown as Response;
        const client = addClient(mockReq, mockRes, (req, res) => ({
            id: 123,
            userId: 'user1',
            res
        }));

        expect(client).toBeUndefined();
    });

    /**
     * Test if addClient removes a client on close.
     */
    test('addClient removes client on close', () => {
        const mockReq = createMockRequest();
        const mockRes = {
            writeHead: jest.fn(),
            write: jest.fn()
        } as unknown as Response;

        addClient(mockReq, mockRes, (req, res) => ({
            id: 123,
            userId: 'user1',
            res
        }));

        triggerCloseEvent();
    });

    /**
     * Test if sendToAllClients sends data to all clients.
     */
    test('sendToAllClients sends data to all clients', () => {
        sendToAllClients({ message: 'Hello, clients!' });

        clientsMock.forEach(client => {
            expect(client.res.write).toHaveBeenCalledWith('data: {"message":"Hello, clients!"}\n\n');
        });
    });

    /**
     * Test if sendToSpecificClient sends data to a specific client (individual userId).
     */
    test('sendToSpecificClient sends data to a specific client (individual userId)', () => {
        const targetUserId = 'user2';
        sendToSpecificClient(targetUserId, { message: 'Hello, user2!' });

        const targetClient = clientsMock.find(client => client.userId === targetUserId);
        expect(targetClient!.res.write).toHaveBeenCalledWith('data: {"message":"Hello, user2!"}\n\n');

        clientsMock
            .filter(client => client.userId !== targetUserId)
            .forEach(client => {
                expect(client.res.write).not.toHaveBeenCalled();
            });
    });

    /**
     * Test if sendToSpecificClient sends data to multiple clients (array of userIds).
     */
    test('sendToSpecificClient sends data to multiple clients (array of userIds)', () => {
        const targetUserIds = ['user1', 'user2']; // Use IDs que correspondem aos clientes em clientsMock
        sendToSpecificClient(targetUserIds, { message: 'Hello, users 1 and 2!' });

        targetUserIds.forEach(userId => {
            const targetClient = clientsMock.find(client => client.userId === userId);
            expect(targetClient!.res.write).toHaveBeenCalledWith('data: {"message":"Hello, users 1 and 2!"}\n\n');
        });

        clientsMock
            .filter(client => !targetUserIds.includes(client.userId))
            .forEach(client => {
                expect(client.res.write).not.toHaveBeenCalled();
            });
    });
});
