import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import slowDown from 'express-slow-down';

import RequestWithUser from '../interfaces/requestWithUser';
import AuthUser from '../interfaces/authUser';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET ?? '';

function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.status(404);
  const error = new Error('Not found - ' + req.originalUrl);
  return next(error);
}

// A basic error handler to handle errors passed to express next function
function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // If the response has a status code, set it, else make it internal server error (500)
  res.status(res.statusCode || 500);
  console.error(err.message);

  // check if we are in production (most deployment services have this env variable set to production)
  if (process.env.NODE_ENV === 'production') {
    // if we are in production send only the message
    res.json({
      message: err.message,
    });
  } else {
    // else send also the stack for debug reasons
    res.json({
      message: err.message,
      stack: err.stack,
    });
  }
}

function checkTokenSetUser(
  req: RequestWithUser, // express request doesn't have user so I created an extended interface which includes user
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  // make sure the auth header exists and then regex split it with a space and take the second element from the array. Expected format: Bearer token
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return next();

  // jsonwebtoken is a library which makes handling jwt tokens easy
  jwt.verify(token, TOKEN_SECRET, (error, payload) => {
    if (error) return next();

    // if the token is valid and there are no errors, set the user on the request
    req.user = payload as AuthUser;
    return next();
  });
}

function isLoggedIn(req: RequestWithUser, res: Response, next: NextFunction) {
  // Check if the request has a user, else send 401 response
  if (!req.user) {
    res.status(401);
    return next(new Error('Unauthorized.'));
  }
  return next();
}

const rateLimitRequest = rateLimit({
  windowMs: 30 * 1000, // 30 seconds
  max: 10, // limit each IP to 10 requests
});

const slowDownRequest = slowDown({
  windowMs: 30 * 1000, // 30 seconds
  delayAfter: 10, // allow 10 requests before starting to delay
  delayMs: 500, // add 500ms to each request after the 10 seconds
});

export default {
  notFoundHandler,
  errorHandler,
  checkTokenSetUser,
  isLoggedIn,
  rateLimitRequest,
  slowDownRequest,
};
