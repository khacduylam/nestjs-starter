import { WinstonModule } from 'nest-winston';
import { format, transports as winstonTransports } from 'winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';
import * as Transport from 'winston-transport';

export interface CreateLoggerProviderOptions {
  debug?: boolean;
  maxLogFiles?: string;
  service?: string;
}
export function createLoggerProvider(options: CreateLoggerProviderOptions) {
  const transports: Transport[] = [];
  // Console log(for debugging)
  if (options?.debug) {
    transports.push(
      new winstonTransports.Console({
        format: format.combine(
          format.colorize({ all: true }),
          format.timestamp({ format: 'YYYY/MM/DD, HH:mm:ss' }),
          prettyFormat,
        ),
      }),
    );
  } else {
    transports.push(
      ...[
        // Daily error logs
        new DailyRotateFile({
          maxFiles: options?.maxLogFiles,
          zippedArchive: false,
          filename: `logs/%DATE%-error.log`,
          level: 'error',
          format: format.combine(
            format.timestamp({ format: 'YYYY/MM/DD, HH:mm:ss' }),
            prettyFormat,
          ),
        }),
        // Daily combined logs
        new DailyRotateFile({
          maxFiles: options?.maxLogFiles,
          zippedArchive: false,
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(
            format.timestamp({ format: 'YYYY/MM/DD, HH:mm:ss' }),
            prettyFormat,
          ),
        }),
      ],
    );
  }

  return WinstonModule.createLogger({
    transports,
    defaultMeta: { service: options?.service },
  });
}

const prettyFormat = format.printf(
  ({ service, stack, level, message, timestamp, context }) => {
    const obj = stack || context;
    return `\x1b[32m[${service}]\x1b[0m - ${timestamp} - [${level}]: ${message} ${
      obj ? JSON.stringify(obj, null, 2) : ''
    }`;
  },
);
