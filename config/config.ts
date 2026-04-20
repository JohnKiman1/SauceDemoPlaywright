import dotenv from 'dotenv';

dotenv.config();

/**
 * Strongly-typed configuration object
 * Keeps environment + test users cleanly separated
 */
type Config = {
  baseURL: string;
  users: {
    valid: {
      username: string;
      password: string;
    };
    invalid: {
      username: string;
      password: string;
    };
  };
};

const requiredEnvVars = ['BASE_URL'] as const;

/**
 * Fail fast if critical CI variables are missing
 */
requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`❌ Missing required environment variable: ${key}`);
  }
});

export const config: Config = {
  baseURL: process.env.BASE_URL || 'https://www.saucedemo.com',

  users: {
    valid: {
      username: process.env.USERNAME || 'standard_user',
      password: process.env.PASSWORD || 'secret_sauce',
    },

    invalid: {
      username: process.env.INVALID_USERNAME || 'invalid_user',
      password: process.env.INVALID_PASSWORD || 'wrong_password',
    },
  },
};