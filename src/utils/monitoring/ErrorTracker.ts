export class ErrorTracker {
  private static errors: Error[] = [];

  static init() {
    window.addEventListener('error', (event) => {
      this.trackError(event.error);
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(event.reason);
    });
  }

  static trackError(error: Error) {
    this.errors.push(error);
    this.logError(error);
    this.notifyAdmin(error);
  }

  private static async logError(error: Error) {
    try {
      await fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent
        })
      });
    } catch (e) {
      console.error('Failed to log error:', e);
    }
  }

  private static async notifyAdmin(error: Error) {
    // Implement admin notification logic
  }
} 