/**
 * Represents a callback function for handling messages in the EventSourceMock.
 * @function
 * @param {any} message - The message to handle.
 */
type EventSourceOnMessageCallback = (message: any) => void;

/**
 * Represents a callback function for handling errors in the EventSourceMock.
 * @function
 * @param {Error} error - The error to handle.
 */
type EventSourceOnErrorCallback = (error: Error) => void;

/**
 * Mock class for EventSource for testing purposes.
 * @class
 */
export class EventSourceMock {
    onmessage: EventSourceOnMessageCallback | null = null;
    onerror: EventSourceOnErrorCallback | null = null;
    url: string;

    /**
     * Creates a new EventSourceMock instance.
     * @constructor
     * @param {string} url - The URL associated with the EventSourceMock.
     */
    constructor(url: string) {
        this.url = url;
    }

    /**
     * Mock method for closing the EventSourceMock.
     */
    close = jest.fn();

    /**
     * Triggers the onmessage callback with the provided message.
     * @param {any} message - The message to trigger.
     */
    triggerOnMessage(message: any) {
        if (this.onmessage) {
            this.onmessage(message);
        }
    }

    /**
     * Triggers the onerror callback with the provided error.
     * @param {Error} error - The error to trigger.
     */
    triggerOnError(error: Error) {
        if (this.onerror) {
            this.onerror(error);
        }
    }
}
