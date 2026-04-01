import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: string;
  user?: any;
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7);
    const secret = process.env.JWT_SECRET || 'your_jwt_secret_here';
    const decoded = jwt.verify(
      token,
      secret as string
    ) as { userId: string; email: string };

    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err.name === 'ValidationError') {
    res.status(400).json({ error: 'Validation error', details: err.message });
    return;
  }

  if (err.name === 'MongoError' && err.code === 11000) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
