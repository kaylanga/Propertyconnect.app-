import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AppError } from './errorHandler';

// Validation schemas
const userProfileSchema = z.object({
  fullName: z.string().min(2).max(100),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/),
  email: z.string().email(),
  userType: z.enum(['seeker', 'landlord', 'broker']),
});

const propertySchema = z.object({
  title: z.string().min(5).max(200),
  description: z.string().min(20).max(2000),
  price: z.number().positive(),
  location: z.string().min(5).max(200),
  propertyType: z.string(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().min(0),
  sizeSqft: z.number().positive(),
});

export const validateInput = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        next(new AppError(400, 'Invalid input: ' + error.errors[0].message));
      } else {
        next(error);
      }
    }
  };
};

export const schemas = {
  userProfile: userProfileSchema,
  property: propertySchema,
}; 