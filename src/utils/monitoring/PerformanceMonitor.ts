export class PerformanceMonitor {
  static async measurePageLoad() {
    const metrics = {
      FCP: await this.getFCP(),
      LCP: await this.getLCP(),
      CLS: await this.getCLS(),
      TTI: await this.getTTI(),
      TTFB: performance.timing.responseStart - performance.timing.navigationStart,
    };

    console.table(metrics);
    return metrics;
  }

  static async getFCP() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[0]?.startTime || 0);
      }).observe({ type: 'paint', buffered: true });
    });
  }

  static async getLCP() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[entries.length - 1]?.startTime || 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  }

  static async getCLS() {
    return new Promise((resolve) => {
      let CLS = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            CLS += entry.value;
          }
        }
        resolve(CLS);
      }).observe({ type: 'layout-shift', buffered: true });
    });
  }

  static async getTTI() {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        resolve(entries[0]?.startTime || 0);
      }).observe({ type: 'largest-contentful-paint', buffered: true });
    });
  }
} 