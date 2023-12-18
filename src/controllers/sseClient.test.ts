import { SSEClient } from './SSEClient'; // Ajuste o caminho de importação conforme necessário
import { EventSourceMock } from '../../__mocks__/eventSourceMock'; // Ajuste o caminho de importação para o seu EventSource mock

/**
 * Test suite for the SSEClient class.
 */
describe('SSEClient', () => {
    const baseUrl: string = 'http://localhost:3000';

    /**
     * Test suite for SSEClient with a single userId.
     */
    describe('with a single userId', () => {
        const userIds: string = 'user1';
        let sseClient: SSEClient;

        beforeEach(() => {
            sseClient = new SSEClient(baseUrl, userIds);
            global.EventSource = jest.fn().mockImplementation(() => new EventSourceMock(baseUrl)) as any;
        });

        /**
         * Test if connect should initialize EventSource with correct URL for a single userId.
         */
        test('connect should initialize EventSource with correct URL for a single userId', () => {
            sseClient.connect();
            expect(global.EventSource).toHaveBeenCalledWith(`${baseUrl}/sse/events?userId=${userIds}`);
        });

        /**
         * Test if connect should assign onmessage handler.
         */
        test('connect should assign onmessage handler', () => {
            const mockHandler = jest.fn();
            sseClient.onMessage(mockHandler);
            sseClient.connect();

            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
                expect(eventSource.onmessage).not.toBeNull();
            }
        });

        /**
         * Test if connect should handle message events.
         */
        test('connect should handle message events', () => {
            const mockHandler = jest.fn();
            sseClient.onMessage(mockHandler);
            sseClient.connect();

            const testMessage = { data: JSON.stringify({ message: 'Hello' }) };
            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
                eventSource.triggerOnMessage(testMessage);
            }

            expect(mockHandler).toHaveBeenCalledWith({ message: 'Hello' });
        });

        /**
         * Test if connect should assign onerror handler.
         */
        test('connect should assign onerror handler', () => {
            const mockErrorHandler = jest.fn();
            sseClient.onError(mockErrorHandler);
            sseClient.connect();

            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
                expect(eventSource.onerror).not.toBeNull();
            }
        });

        /**
         * Test if connect should handle error events and disconnect.
         */
        test('connect should handle error events and disconnect', () => {
            const mockErrorHandler = jest.fn();
            sseClient.onError(mockErrorHandler);
            sseClient.connect();

            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
                eventSource.triggerOnError(new Error('Connection error'));
            }

            expect(mockErrorHandler).toHaveBeenCalled();
            expect(sseClient.getEventSource()).toBeNull();
        });

        /**
         * Test if disconnect should close EventSource.
         */
        test('disconnect should close EventSource', () => {
            sseClient.connect();
            sseClient.disconnect();

            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
                expect(eventSource.close).toHaveBeenCalled();
            }
            expect(sseClient.getEventSource()).toBeNull();
        });

        /**
         * Test if connect should not call disconnect if there is no error.
         */
        test('connect should not call disconnect if there is no error', () => {
            const mockErrorHandler = jest.fn();
            sseClient.onError(mockErrorHandler);
            sseClient.connect();

            const eventSource = sseClient.getEventSource();
            if (eventSource instanceof EventSourceMock) {
            }
            expect(mockErrorHandler).not.toHaveBeenCalled();
            expect(sseClient.getEventSource()).not.toBeNull();
        });
    });

    /**
     * Test suite for SSEClient with multiple userIds.
     */
    describe('with multiple userIds', () => {
        const userIds: string[] = ['user1', 'user2'];
        let sseClient: SSEClient;

        beforeEach(() => {
            sseClient = new SSEClient(baseUrl, userIds);
            global.EventSource = jest.fn().mockImplementation(() => new EventSourceMock(baseUrl)) as any;
        });

        /**
         * Test if connect should initialize EventSource with correct URL for multiple userIds.
         */
        test('connect should initialize EventSource with correct URL for multiple userIds', () => {
            sseClient.connect();
            expect(global.EventSource).toHaveBeenCalledWith(`${baseUrl}/sse/events?userId=user1,user2`);
        });
    });
});
