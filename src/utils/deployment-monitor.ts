export const deploymentMonitor = {
  async checkHealth() {
    try {
      const response = await fetch('/.netlify/functions/health-check');
      const data = await response.json();
      return data.status === 'healthy';
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  },

  async getDeploymentStatus() {
    try {
      const response = await fetch('/.netlify/functions/deployment-status');
      return await response.json();
    } catch (error) {
      console.error('Failed to get deployment status:', error);
      return null;
    }
  }
}; 