declare class VSCodeWrapper {
    private readonly vscodeApi;
    /**
     * Send message to the extension framework.
     * @param message
     */
    postMessage(message: any): void;
    /**
     * Add listener for messages from extension framework.
     * @param callback called when the extension sends a message
     * @returns function to clean up the message eventListener.
     */
    onMessage(callback: (message: any) => void): () => void;
}
export declare const vscodeAPI: VSCodeWrapper;
export {};
