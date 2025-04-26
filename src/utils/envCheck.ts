interface EnvVariable {
  name: string;
  required: boolean;
  description: string;
}

const requiredEnvVariables: EnvVariable[] = [
  {
    name: 'VITE_SUPABASE_URL',
    required: true,
    description: 'Supabase project URL'
  },
  {
    name: 'VITE_SUPABASE_ANON_KEY',
    required: true,
    description: 'Supabase anonymous key'
  },
  {
    name: 'VITE_FIREBASE_API_KEY',
    required: true,
    description: 'Firebase API key'
  },
  {
    name: 'VITE_FIREBASE_AUTH_DOMAIN',
    required: true,
    description: 'Firebase authentication domain'
  },
  {
    name: 'VITE_FIREBASE_PROJECT_ID',
    required: true,
    description: 'Firebase project ID'
  },
  {
    name: 'VITE_SENTRY_DSN',
    required: false,
    description: 'Sentry DSN for error tracking'
  }
];

export function checkEnvVariables(): boolean {
  const missingVariables: string[] = [];
  const invalidVariables: string[] = [];

  requiredEnvVariables.forEach(({ name, required }) => {
    const value = import.meta.env[name];
    
    if (required && !value) {
      missingVariables.push(name);
    } else if (value && typeof value !== 'string') {
      invalidVariables.push(name);
    }
  });

  if (missingVariables.length > 0) {
    console.error('Missing required environment variables:', missingVariables);
    return false;
  }

  if (invalidVariables.length > 0) {
    console.error('Invalid environment variables:', invalidVariables);
    return false;
  }

  return true;
}

export function getEnvVariable(name: string, defaultValue?: string): string {
  const value = import.meta.env[name];
  
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  
  return value || defaultValue || '';
} 