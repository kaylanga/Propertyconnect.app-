export const monitorDeployment = {
  checkHealth: async () => {
    try {
      const response = await fetch('/api/health');
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  logPerformance: () => {
    if (window.performance) {
      const timing = window.performance.timing;
      console.log('Page Load Time:', timing.loadEventEnd - timing.navigationStart);
      console.log('DNS Time:', timing.domainLookupEnd - timing.domainLookupStart);
      console.log('Server Response Time:', timing.responseEnd - timing.requestStart);
      console.log('Page Render Time:', timing.domComplete - timing.domLoading);
    }
  }
}; 