export const checkEnvVariables = () => {
  const required = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY',
    'VITE_STRIPE_PUBLISHABLE_KEY'
  ];

  required.forEach(variable => {
    if (!import.meta.env[variable]) {
      console.error(`Missing environment variable: ${variable}`);
    }
  });
}; 