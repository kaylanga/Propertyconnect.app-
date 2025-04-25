export class DebugUtils {
  private static timers: Map<string, number> = new Map();

  static startTimer(label: string) {
    this.timers.set(label, performance.now());
  }

  static endTimer(label: string) {
    const start = this.timers.get(label);
    if (!start) {
      console.warn(`No timer found for: ${label}`);
      return;
    }
    const duration = performance.now() - start;
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    this.timers.delete(label);
  }

  static async measureAsync<T>(label: string, fn: () => Promise<T>): Promise<T> {
    this.startTimer(label);
    try {
      const result = await fn();
      this.endTimer(label);
      return result;
    } catch (error) {
      this.endTimer(label);
      throw error;
    }
  }

  static logMemoryUsage() {
    const used = process.memoryUsage();
    console.log('Memory Usage:');
    for (const [key, value] of Object.entries(used)) {
      console.log(`  ${key}: ${(value / 1024 / 1024).toFixed(2)} MB`);
    }
  }
} 