import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

// =========================================
// DEFAULT FALLBACKS (CI SAFE)
// =========================================
const DEFAULTS = {
  BASE_URL: 'https://www.saucedemo.com',
  USERNAME: 'standard_user',
  PASSWORD: 'secret_sauce',
};

// =========================================
// SAFE ENV LOADER
// =========================================
function getEnv(key: keyof typeof DEFAULTS): string {
  const value = process.env[key];

  if (value) return value;

  // CI fallback (DO NOT crash pipeline)
  if (process.env.CI) {
    console.warn(`⚠️ CI missing ${key}, using fallback value`);
    return DEFAULTS[key];
  }

  // Local strict mode
  throw new Error(`❌ Missing required environment variable: ${key}`);
}

// =========================================
// CONFIG EXPORT
// =========================================
export const config = {
  baseURL: getEnv('BASE_URL'),

  users: {
    valid: {
      username: getEnv('USERNAME'),
      password: getEnv('PASSWORD'),
    },
    invalid: {
      username: 'invalid_user',
      password: 'invalid_pass',
    },
  },
};