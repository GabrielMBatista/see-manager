import { Response } from 'express';

/**
 * Represents a client object used in mock data.
 * @interface
 */
interface Client {
    id: number;
    userId: string;
    res: Response;
}

/**
 * Creates a mock Response object.
 * @returns {Response} The mock Response object.
 */
const createResponseMock = (): Response => ({
    write: jest.fn() as unknown as (chunk: any) => boolean,
} as unknown as Response);

/**
 * Array of mock clients.
 * @type {Client[]}
 */
export const clientsMock: Client[] = [
    {
        id: 1,
        userId: 'user1',
        res: createResponseMock(),
    },
    {
        id: 2,
        userId: 'user2',
        res: createResponseMock(),
    },
];

/**
 * Resets mock data by clearing the mock write functions of client responses.
 */
export const resetMocks = () => {
    clientsMock.forEach(client => {
        (client.res.write as jest.Mock).mockClear();
    });
};
