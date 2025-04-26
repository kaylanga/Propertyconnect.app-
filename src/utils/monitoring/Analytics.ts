import { Metric } from 'web-vitals';

export const sendToAnalytics = (metric: Metric) => {
  // In a real application, you would send this to your analytics service
  console.log('Analytics:', metric);
}; 