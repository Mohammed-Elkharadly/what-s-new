import type { Request, Response, NextFunction } from 'express';
import rateLimit, { type Options } from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // Time window: 1 minute (60,000 milliseconds).
  limit: 3, // The maximum number of connections to allow during the window before rate limiting the client
  message: {
    message:
      'Too many login attempts from this IP, please try again after a minute',
  },
  handler(req: Request, res: Response, next: NextFunction, options: Options) {
    // Send the appropriate status code (429 Too Many Requests) and the custom message.
    res.status(options.statusCode).json(options.message);
  },
  // These control which headers Express sends back to the client.
  standardHeaders: true, // Adds standard `RateLimit-*` headers to the response.
  // RateLimit-Limit: 3
  // RateLimit-Remaining: 2
  // RateLimit-Reset: 45
  legacyHeaders: false, // Disables older `X-RateLimit-*` headers.
  // X-RateLimit-Limit
  // X-RateLimit-Remaining
  // X-RateLimit-Reset
});
