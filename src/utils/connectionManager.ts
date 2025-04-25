class ConnectionManager {
  private retryAttempts: number = 3;
  private retryDelay: number = 1000; // 1 second
  private maxRetryDelay: number = 5000; // 5 seconds

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    customRetryAttempts?: number
  ): Promise<T> {
    let attempts = 0;
    const maxAttempts = customRetryAttempts || this.retryAttempts;

    while (attempts < maxAttempts) {
      try {
        return await operation();
      } catch (error: any) {
        attempts++;
        
        if (attempts === maxAttempts) {
          throw error;
        }

        const delay = Math.min(
          this.retryDelay * Math.pow(2, attempts - 1),
          this.maxRetryDelay
        );

        console.warn(`Attempt ${attempts} failed. Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw new Error('All retry attempts failed');
  }

  async clearConnections() {
    // Implement connection clearing logic here
    try {
      // Clear any active WebSocket connections
      const ws = window.WebSocket.prototype;
      if (ws) {
        ws.close();
      }

      // Clear any pending fetch requests
      // This is a basic implementation and might need to be adapted
      if (window.AbortController) {
        const controller = new AbortController();
        controller.abort();
      }

      // Clear any active XMLHttpRequests
      const xhrProto = window.XMLHttpRequest.prototype;
      if (xhrProto) {
        const originalSend = xhrProto.send;
        xhrProto.send = function() {
          this.abort();
          xhrProto.send = originalSend;
        };
      }
    } catch (error) {
      console.error('Error clearing connections:', error);
    }
  }
}

export const connectionManager = new ConnectionManager(); 