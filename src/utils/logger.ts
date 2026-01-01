import { blue, bold, dim, green, red, yellow } from 'colorette';

const isProduction = process.env.NODE_ENV === 'production';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

/**
 * Internal logging function
 */
function log(level: LogLevel, message: string, ...meta: unknown[]) {
  if (isProduction && level === 'debug') {
    // Skip debug logs in production
    return;
  }

  const timestamp = dim(new Date().toISOString());

  let output: string;

  switch (level) {
    case 'info': {
      output = `${timestamp} ${blue(bold('[INFO]'))} ${message}`;
      break;
    }
    case 'warn': {
      output = `${timestamp} ${yellow(bold('[WARN]'))} ${message}`;
      break;
    }
    case 'error': {
      output = `${timestamp} ${red(bold('[ERROR]'))} ${message}`;
      break;
    }
    case 'debug': {
      output = `${timestamp} ${green(bold('[DEBUG]'))} ${message}`;
      break;
    }
  }

  console.log(output, ...meta);
}

/**
 * Exported helpers
 */
export const logger = {
  info: (message: string, ...meta: unknown[]) => log('info', message, ...meta),
  warn: (message: string, ...meta: unknown[]) => log('warn', message, ...meta),
  error: (message: string, ...meta: unknown[]) =>
    log('error', message, ...meta),
  debug: (message: string, ...meta: unknown[]) =>
    log('debug', message, ...meta),
};
