import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const requiredEnvVars = ['BASE_URL', 'USERNAME', 'PASSWORD'] as const;

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ CI missing ${key}, using fallback value`);
  }
});

export const config = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

  users: {
    valid: {
      username: process.env.USERNAME || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },
    invalid: {
      username: 'invalid_user',
      password: 'invalid_password',
    },
  },
};