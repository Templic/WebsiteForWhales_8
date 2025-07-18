/**
 * validation.ts
 * 
 * Advanced middleware for input validation using Zod schemas.
 * This middleware provides comprehensive validation for request data
 * including body, query parameters, URL parameters, and headers.
 */

import { Request, Response, NextFunction } from 'express';
import { ZodSchema, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { logSecurityEvent } from '../security/security';

/**
 * Options for validation middleware
 */
export interface ValidationOptions {
  /**
   * Whether to add the validated data to req.validatedData
   */
  addValidatedData?: boolean;
  
  /**
   * Custom error message
   */
  errorMessage?: string;
  
  /**
   * Log validation errors as security events
   */
  logSecurityEvents?: boolean;
}

/**
 * Creates middleware to validate request body against a Zod schema
 * 
 * @param schema Zod schema to validate against
 * @param options Validation options
 */
export const validateBody = (schema: ZodSchema, options: ValidationOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        
        // Log validation failure as security event if enabled
        if (options.logSecurityEvents) {
          logSecurityEvent({
            type: 'VALIDATION_FAILURE',
            ip: req.ip,
            userAgent: req.headers['user-agent']?.toString(),
            userId: (req.user as unknown)?.id,
            username: (req.user as unknown)?.username,
            details: `Body validation failed: ${validationError.message}`,
            resource: req.originalUrl,
            severity: 'medium'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: options.errorMessage || 'Invalid request data',
          errors: validationError.details || validationError.message
        });
      }
      
      // Add validated data to request if enabled
      if (options.addValidatedData) {
        (req as unknown).validatedData = result.data;
      }
      
      return next();
    } catch (error: unknown) {
      console.error('Validation middleware error:', error);
      
      if (options.logSecurityEvents) {
        logSecurityEvent({
          type: 'VALIDATION_ERROR',
          ip: req.ip,
          userAgent: req.headers['user-agent']?.toString(),
          userId: (req.user as unknown)?.id,
          username: (req.user as unknown)?.username,
          details: `Validation middleware error: ${error instanceof Error ? error.message : String(error)}`,
          resource: req.originalUrl,
          severity: 'high'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'An error occurred during request validation'
      });
    }
  };
};

/**
 * Creates middleware to validate request query parameters against a Zod schema
 */
export const validateQuery = (schema: ZodSchema, options: ValidationOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.query);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        
        if (options.logSecurityEvents) {
          logSecurityEvent({
            type: 'VALIDATION_FAILURE',
            ip: req.ip,
            userAgent: req.headers['user-agent']?.toString(),
            userId: (req.user as unknown)?.id,
            username: (req.user as unknown)?.username,
            details: `Query validation failed: ${validationError.message}`,
            resource: req.originalUrl,
            severity: 'medium'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: options.errorMessage || 'Invalid query parameters',
          errors: validationError.details || validationError.message
        });
      }
      
      if (options.addValidatedData) {
        (req as unknown).validatedQuery = result.data;
      }
      
      return next();
    } catch (error: unknown) {
      console.error('Query validation middleware error:', error);
      
      if (options.logSecurityEvents) {
        logSecurityEvent({
          type: 'VALIDATION_ERROR',
          ip: req.ip,
          userAgent: req.headers['user-agent']?.toString(),
          userId: (req.user as unknown)?.id,
          username: (req.user as unknown)?.username,
          details: `Query validation middleware error: ${error instanceof Error ? error.message : String(error)}`,
          resource: req.originalUrl,
          severity: 'high'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'An error occurred during query parameter validation'
      });
    }
  };
};

/**
 * Creates middleware to validate URL parameters against a Zod schema
 */
export const validateParams = (schema: ZodSchema, options: ValidationOptions = {}) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = schema.safeParse(req.params);
      
      if (!result.success) {
        const validationError = fromZodError(result.error);
        
        if (options.logSecurityEvents) {
          logSecurityEvent({
            type: 'VALIDATION_FAILURE',
            ip: req.ip,
            userAgent: req.headers['user-agent']?.toString(),
            userId: (req.user as unknown)?.id,
            username: (req.user as unknown)?.username,
            details: `URL parameters validation failed: ${validationError.message}`,
            resource: req.originalUrl,
            severity: 'medium'
          });
        }
        
        return res.status(400).json({
          success: false,
          message: options.errorMessage || 'Invalid URL parameters',
          errors: validationError.details || validationError.message
        });
      }
      
      if (options.addValidatedData) {
        (req as unknown).validatedParams = result.data;
      }
      
      return next();
    } catch (error: unknown) {
      console.error('Params validation middleware error:', error);
      
      if (options.logSecurityEvents) {
        logSecurityEvent({
          type: 'VALIDATION_ERROR',
          ip: req.ip,
          userAgent: req.headers['user-agent']?.toString(),
          userId: (req.user as unknown)?.id,
          username: (req.user as unknown)?.username,
          details: `Params validation middleware error: ${error instanceof Error ? error.message : String(error)}`,
          resource: req.originalUrl,
          severity: 'high'
        });
      }
      
      return res.status(500).json({
        success: false,
        message: 'An error occurred during URL parameter validation'
      });
    }
  };
};

/**
 * Common schema for ID parameters
 */
export const idParamSchema = z.object({
  id: z.string().refine(
    (val) => !isNaN(parseInt(val)) && parseInt(val) > 0,
    { message: 'ID must be a positive integer' }
  )
});

/**
 * Common schema for pagination query parameters
 */
export const paginationSchema = z.object({
  page: z.string().optional()
    .refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 1), 
      { message: 'Page must be a positive integer' })
    .transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional()
    .refine(val => !val || (!isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 100), 
      { message: 'Limit must be a positive integer between 1 and 100' })
    .transform(val => val ? parseInt(val) : 10)
});

/**
 * Common schema for date range query parameters
 */
export const dateRangeSchema = z.object({
  fromDate: z.string().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), 
      { message: 'Invalid fromDate format' }),
  toDate: z.string().optional()
    .refine(val => !val || !isNaN(Date.parse(val)), 
      { message: 'Invalid toDate format' })
});