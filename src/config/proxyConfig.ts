import type { ProxyOptions } from 'vite';
import { defineConfig } from 'vite';

export const proxyConfig: Record<string, ProxyOptions> = {
  '/api': {
    target: import.meta.env.VITE_API_URL || 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    ws: true,
    onProxyRes: (proxyRes: any) => {
      // Remove problematic headers
      delete proxyRes.headers['x-powered-by'];
      // Add CORS headers
      proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
  }
}; 