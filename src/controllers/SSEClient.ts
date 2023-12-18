/**
 * Represents a function that handles a message.
 * @function
 * @param {any} message - The message to handle.
 */
type MessageHandler = (message: any) => void;

/**
 * Represents a function that handles an error.
 * @function
 * @param {any} error - The error to handle.
 */
type ErrorHandler = (error: any) => void;

/**
 * Represents a client for Server-Sent Events (SSE) communication.
 * @class
 */
export class SSEClient {
    private eventSource: EventSource | null = null;
    private baseUrl: string;
    private userIds: string | string[];
    private messageHandler?: MessageHandler;
    private errorHandler?: ErrorHandler;

    /**
     * Get the EventSource instance associated with the client.
     * @returns {EventSource | null} The EventSource instance or null if not connected.
     */
    public getEventSource(): EventSource | null {
        return this.eventSource;
    }

    /**
     * Creates a new SSEClient.
     * @constructor
     * @param {string} baseUrl - The base URL for the SSE server.
     * @param {string | string[]} userIds - The user ID(s) to subscribe to events.
     */
    constructor(baseUrl: string, userIds: string | string[]) {
        this.baseUrl = baseUrl;
        this.userIds = userIds;
    }

    /**
     * Register a callback function to handle incoming messages.
     * @param {MessageHandler} handler - The message handling function.
     */
    onMessage(handler: MessageHandler): void {
        this.messageHandler = handler;
    }

    /**
     * Register a callback function to handle errors.
     * @param {ErrorHandler} handler - The error handling function.
     */
    onError(handler: ErrorHandler): void {
        this.errorHandler = handler;
    }

    /**
     * Connect to the SSE server.
     */
    connect(): void {
        const userIdParam = Array.isArray(this.userIds)
            ? this.userIds.join(',')
            : this.userIds;

        const urlWithUserIds = `${this.baseUrl}/sse/events?userId=${userIdParam}`;
        this.eventSource = new EventSource(urlWithUserIds);

        this.eventSource.onmessage = event => {
            if (this.messageHandler) {
                const data = JSON.parse(event.data);
                this.messageHandler(data);
            }
        };

        this.eventSource.onerror = error => {
            if (this.errorHandler) {
                this.errorHandler(error);
            }
            this.disconnect();
        };
    }

    /**
     * Disconnect from the SSE server.
     */
    disconnect(): void {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
}
