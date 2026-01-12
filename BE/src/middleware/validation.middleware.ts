import { Request, Response, NextFunction } from 'express';

export const validateCustomerCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Name is required and must be a non-empty string',
    });
  }

  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      error: 'Valid email is required',
    });
  }

  next();
};

export const validateCustomerUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email } = req.body;

  if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
    return res.status(400).json({
      success: false,
      error: 'Name must be a non-empty string',
    });
  }

  if (email !== undefined && (typeof email !== 'string' || !isValidEmail(email))) {
    return res.status(400).json({
      success: false,
      error: 'Email must be valid',
    });
  }

  next();
};

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
