import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', error);

  if (error instanceof ZodError) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.issues.map((issue: ZodIssue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'JsonWebTokenError'
  ) {
    return res.status(401).json({
      message: 'Invalid token',
    });
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    error.name === 'TokenExpiredError'
  ) {
    return res.status(401).json({
      message: 'Token expired',
    });
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2002'
  ) {
    return res.status(409).json({
      message: 'A record with this value already exists',
    });
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    error.code === 'P2025'
  ) {
    return res.status(404).json({
      message: 'Record not found',
    });
  }

  const statusCode =
    typeof error === 'object' && error !== null && 'statusCode' in error
      ? (error as any).statusCode
      : 500;

  const message =
    typeof error === 'object' && error !== null && 'message' in error
      ? (error as any).message
      : 'Internal server error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' &&
      typeof error === 'object' &&
      error !== null &&
      'stack' in error && { stack: (error as any).stack }),
  });
};
