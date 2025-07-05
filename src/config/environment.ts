// Environment configuration
const getApiBaseUrl = () => {
  // Check for environment variable first
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  
  // Default to localhost:8000 for development
  return 'http://localhost:8000/api/v1';
};

export const ENV_CONFIG = {
  API_BASE_URL: getApiBaseUrl(),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
}; 