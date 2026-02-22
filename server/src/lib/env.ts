import 'dotenv/config';

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}
function requireEnvNumber(key: string): number {
  const raw = process.env[key];
  if (!raw || raw.trim() === '') {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  const value = Number(raw);
  if (isNaN(value)) {
    throw new Error(`Environment variable ${key} must be a valid number`);
  }
  return value;
}
function parseDnsServers(key: string): string[] {
  const value = process.env[key];
  if (!value) return [];
  return value
    .split(',')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  MONGO_URI: string;
  JWT_SECRET_KEY: string;
  JWT_EXPIRES_IN: number;
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  RESEND_EMAIL: string;
  CLIENT_URL: string;
  CUSTOM_DNS_SERVERS?: string[];
}
export const ENV: EnvConfig = {
  PORT: Number(process.env.PORT) || 5000,
  NODE_ENV: requireEnv('NODE_ENV'),
  MONGO_URI: requireEnv('MONGO_URI'),
  JWT_SECRET_KEY: requireEnv('JWT_SECRET_KEY'),
  JWT_EXPIRES_IN: requireEnvNumber('JWT_EXPIRES_IN'),
  RESEND_API_KEY: requireEnv('RESEND_API_KEY'),
  RESEND_FROM: requireEnv('RESEND_FROM'),
  RESEND_EMAIL: requireEnv('RESEND_EMAIL'),
  CLIENT_URL: requireEnv('CLIENT_URL'),
  CUSTOM_DNS_SERVERS: parseDnsServers('CUSTOM_DNS_SERVERS'),
};
