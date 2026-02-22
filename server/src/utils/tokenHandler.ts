import type { Response } from 'express';
import { ENV } from '../lib/env.js';

export class TokenHandler {
  // we make it static so we don't 'new' it every time
  static attachCookie(res: Response, token: string): void {
    const oneDay = 1000 * 60 * 60 * 24;
    res.cookie('token', token, {
      // Flags the cookie to be accessible only by the web server.
      httpOnly: true,
      // Marks the cookie to be used with HTTPS only
      secure: ENV.NODE_ENV === 'production',
      // CSRF 'Cross-Site Request Forgery' attacks
      sameSite: 'strict',
      //  expiry time relative to the current time in milliseconds
      maxAge: Number(ENV.JWT_EXPIRES_IN) * oneDay,
    });
  }
  static clearCookie(res: Response): void {
    res.clearCookie('token', {
      httpOnly: true,
      secure: ENV.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // sets expiration to the past 'deletes it'
    });
  }
}
