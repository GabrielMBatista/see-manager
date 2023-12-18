// src/controllers/SSEServer.ts
import { Request, Response } from 'express';

/**
 * Represents a client connected to the server.
 * @interface
 */
interface Client {
    id: number;
    userId: string;
    res: Response;
}

let clients: Client[] = [];

/**
 * Set the list of clients.
 * @param {Client[]} newClients - The new list of clients.
 */
export const setClients = (newClients: Client[]) => {
    clients = newClients;
};

/**
 * Add a new client to the server.
 * @param {Request} req - The Express request object.
 * @param {Response} res - The Express response object.
 * @param {Function} createClient - A function to create a new client.
 */
const addClient = (req: Request, res: Response, createClient: (req: Request, res: Response) => Client): void => {
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
    });

    const newClient: Client = createClient(req, res);
    clients.push(newClient);

    req.on('close', () => {
        clients = clients.filter(client => client.id !== newClient.id);
    });
};

/**
 * Send data to all connected clients.
 * @param {object} data - The data to send to clients.
 */
const sendToAllClients = (data: object): void => {
    clients.forEach(client =>
        client.res.write(`data: ${JSON.stringify(data)}\n\n`)
    );
};

/**
 * Send data to specific client(s).
 * @param {string | string[]} userIdToFind - The user ID(s) of the client(s) to send data to.
 * @param {object} data - The data to send to clients.
 */
const sendToSpecificClient = (userIdToFind: string | string[], data: object): void => {
    const userIdArray = Array.isArray(userIdToFind) ? userIdToFind : [userIdToFind];

    clients.forEach(client => {
        if (userIdArray.includes(client.userId)) {
            client.res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    });
};

export { addClient, sendToAllClients, sendToSpecificClient };

