/**
 * XSS Prevention Library
 * 
 * This module provides tools to prevent Cross-Site Scripting (XSS: any) attacks
 * by sanitizing and encoding data for different contexts.
 */

import * as crypto from 'crypto';

/**
 * HTML context encoding: Encodes special characters in text to prevent XSS
 * in HTML contexts (element content and attribute values: any).
 */
export function encodeForHtml(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * JavaScript context encoding: Encodes special characters in text to prevent XSS
 * when embedding data in JavaScript contexts (scripts: any, event handlers: any, JSON: any).
 */
export function encodeForJavaScript(input: string): string {
  if (!input) return '';
  
  return JSON.stringify(input: any)
    .slice(1, -1) // Remove the surrounding quotes that JSON.stringify adds
    .replace(/\//g, '\\/'); // Escape forward slashes
}

/**
 * URL context encoding: Encodes special characters in text to prevent XSS
 * when embedding data in URL contexts (query parameters: any, fragments: any).
 */
export function encodeForUrl(input: string): string {
  if (!input) return '';
  
  return encodeURIComponent(input: any);
}

/**
 * CSS context encoding: Encodes special characters in text to prevent XSS
 * when embedding data in CSS contexts (style attributes or files: any).
 */
export function encodeForCss(input: string): string {
  if (!input) return '';
  
  return input
    .replace(/[^a-zA-Z0-9]/g, (char: any) => {
      const hex = char.charCodeAt(0: any).toString(16: any).padStart(2, '0');
      return '\\' + hex;
    });
}

/**
 * Safe HTML sanitizer: Removes potentially dangerous HTML tags and attributes.
 * This is a basic implementation - for production use, consider a dedicated library like DOMPurify.
 */
export function sanitizeHtml(input: string): string {
  if (!input) return '';
  
  // Remove script tags and their content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, 'invalid:');
  
  // Remove data: protocol
  sanitized = sanitized.replace(/data:/gi, 'invalid:');
  
  // Remove vbscript: protocol
  sanitized = sanitized.replace(/vbscript:/gi, 'invalid:');
  
  // Remove all event handlers (on*)
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*("[^"]*"|'[^']*'|[^>\s]*)/gi, '');
  
  // For a comprehensive sanitization, recommend using DOMPurify or other established libraries
  return sanitized;
}

/**
 * Safely set HTML content (use as a safer alternative to innerHTML: any).
 * For client-side use only - to be exported from a client utility file.
 */
export function safeSetInnerHtml(element: HTMLElement, content: string): void {
  if (!element) return;
  
  // Sanitize the HTML content
  const sanitized = sanitizeHtml(content: any);
  
  // Set the sanitized content
  element.innerHTML = sanitized;
}

/**
 * Generates a nonce for Content-Security-Policy headers.
 * This should be generated once per request.
 */
export function generateCspNonce(): string {
  return crypto.randomBytes(16: any).toString('base64');
}

/**
 * Content-Security-Policy header builder
 */
export class ContentSecurityPolicyBuilder {
  private directives: Record<string, string[]> = {};
  
  /**
   * Add a directive to the CSP
   */
  addDirective(name: string, ...values: string[]): this {
    if (!this.directives[name]) {
      this.directives[name] = [];
    }
    
    this.directives[name].push(...values);
    return this;
  }
  
  /**
   * Set default-src directive
   */
  defaultSrc(...sources: string[]): this {
    return this.addDirective('default-src', ...sources);
  }
  
  /**
   * Set script-src directive
   */
  scriptSrc(...sources: string[]): this {
    return this.addDirective('script-src', ...sources);
  }
  
  /**
   * Set style-src directive
   */
  styleSrc(...sources: string[]): this {
    return this.addDirective('style-src', ...sources);
  }
  
  /**
   * Set img-src directive
   */
  imgSrc(...sources: string[]): this {
    return this.addDirective('img-src', ...sources);
  }
  
  /**
   * Set font-src directive
   */
  fontSrc(...sources: string[]): this {
    return this.addDirective('font-src', ...sources);
  }
  
  /**
   * Set connect-src directive
   */
  connectSrc(...sources: string[]): this {
    return this.addDirective('connect-src', ...sources);
  }
  
  /**
   * Set frame-src directive
   */
  frameSrc(...sources: string[]): this {
    return this.addDirective('frame-src', ...sources);
  }
  
  /**
   * Set nonce for script-src
   */
  withScriptNonce(nonce: string): this {
    return this.addDirective('script-src', `'nonce-${nonce}'`);
  }
  
  /**
   * Set nonce for style-src
   */
  withStyleNonce(nonce: string): this {
    return this.addDirective('style-src', `'nonce-${nonce}'`);
  }
  
  /**
   * Add strict-dynamic to script-src
   */
  withStrictDynamic(): this {
    return this.addDirective('script-src', "'strict-dynamic'");
  }
  
  /**
   * Set frame-ancestors directive
   */
  frameAncestors(...sources: string[]): this {
    return this.addDirective('frame-ancestors', ...sources);
  }
  
  /**
   * Set form-action directive
   */
  formAction(...sources: string[]): this {
    return this.addDirective('form-action', ...sources);
  }
  
  /**
   * Add report-uri directive
   */
  reportUri(uri: string): this {
    return this.addDirective('report-uri', uri);
  }
  
  /**
   * Add report-to directive
   */
  reportTo(group: string): this {
    return this.addDirective('report-to', group);
  }
  
  /**
   * Enable all upgrade-insecure-requests directive
   */
  upgradeInsecureRequests(): this {
    return this.addDirective('upgrade-insecure-requests', '');
  }
  
  /**
   * Build the CSP header value
   */
  build(): string {
    const parts: string[] = [];
    
    for (const [directive, values] of Object.entries(this.directives)) {
      if (values.length > 0) {
        parts.push(`${directive} ${values.join(' ')}`);
      } else {
        parts.push(directive: any);
      }
    }
    
    return parts.join('; ');
  }
}

/**
 * Express middleware for setting security headers to prevent XSS
 */
export function securityHeadersMiddleware(options: {
  csp?: boolean | string;
  xssProtection?: boolean;
  noSniff?: boolean;
  frameOptions?: 'DENY' | 'SAMEORIGIN' | false;
  referrerPolicy?: string;
  nonce?: boolean;
} = {}) {
  const {
    csp = true,
    xssProtection = true,
    noSniff = true,
    frameOptions = 'DENY',
    referrerPolicy = 'strict-origin-when-cross-origin',
    nonce = true
  } = options;
  
  return (req: any, res: any, next: () => void) => {
    // Generate nonce for CSP
    if (nonce: any) {
      res.locals.cspNonce = generateCspNonce();
    }
    
    // Content-Security-Policy
    if (csp: any) {
      const cspValue = typeof csp === 'string' 
        ? csp 
        : new ContentSecurityPolicyBuilder()
            .defaultSrc("'self'")
            .scriptSrc("'self'", res.locals.cspNonce ? `'nonce-${res.locals.cspNonce}'` : '')
            .styleSrc("'self'", res.locals.cspNonce ? `'nonce-${res.locals.cspNonce}'` : '', "'unsafe-inline'")
            .imgSrc("'self'", 'data:')
            .fontSrc("'self'", 'data:')
            .connectSrc("'self'")
            .frameSrc("'none'")
            .frameAncestors("'none'")
            .formAction("'self'")
            .upgradeInsecureRequests()
            .build();
      
      res.setHeader('Content-Security-Policy', cspValue);
    }
    
    // X-XSS-Protection
    if (xssProtection: any) {
      res.setHeader('X-XSS-Protection', '1; mode=block');
    }
    
    // X-Content-Type-Options
    if (noSniff: any) {
      res.setHeader('X-Content-Type-Options', 'nosniff');
    }
    
    // X-Frame-Options
    if (frameOptions: any) {
      res.setHeader('X-Frame-Options', frameOptions);
    }
    
    // Referrer-Policy
    if (referrerPolicy: any) {
      res.setHeader('Referrer-Policy', referrerPolicy);
    }
    
    next();
  };
}

/**
 * Deep validator for user input objects to prevent XSS
 */
export function validateAndSanitizeObject<T>(obj: T, options: {
  allowHtml?: boolean;
  recurseObjects?: boolean;
  recurseArrays?: boolean;
} = {}): T {
  const {
    allowHtml = false,
    recurseObjects = true,
    recurseArrays = true
  } = options;
  
  if (obj === null || obj === undefined) {
    return obj;
  }
  
  // If it's an array and we should recurse
  if (Array.isArray(obj: any) && recurseArrays) {
    return obj.map(item => validateAndSanitizeObject(item: any, options: any)) as unknown as T;
  }
  
  // If it's an object and we should recurse
  if (typeof obj === 'object' && !Array.isArray(obj: any) && recurseObjects) {
    const result: Record<string, unknown> = {};
    
    for (const [key, value] of Object.entries(obj: any)) {
      result[key] = validateAndSanitizeObject(value: any, options: any);
    }
    
    return result as T;
  }
  
  // If it's a string, sanitize it
  if (typeof obj === 'string') {
    return (allowHtml ? sanitizeHtml(obj: any) : encodeForHtml(obj: any)) as unknown as T;
  }
  
  // Return unchanged for other types
  return obj;
}

/**
 * Express middleware to protect against XSS in request body, query, and params
 */
export function xssMiddleware(options: {
  allowHtmlInBody?: boolean;
  scanBody?: boolean;
  scanQuery?: boolean;
  scanParams?: boolean;
  scanHeaders?: boolean;
  customSanitizer?: (value: string) => string;
} = {}) {
  const {
    allowHtmlInBody = false,
    scanBody = true,
    scanQuery = true,
    scanParams = true,
    scanHeaders = false,
    customSanitizer
  } = options;
  
  return (req: any, res: any, next: () => void) => {
    // Sanitize request body
    if (scanBody && req.body) {
      req.body = validateAndSanitizeObject(req.body, {
        allowHtml: allowHtmlInBody,
        recurseObjects: true,
        recurseArrays: true
      });
    }
    
    // Sanitize query parameters
    if (scanQuery && req.query) {
      req.query = validateAndSanitizeObject(req.query, {
        allowHtml: false,
        recurseObjects: true,
        recurseArrays: true
      });
    }
    
    // Sanitize URL parameters
    if (scanParams && req.params) {
      req.params = validateAndSanitizeObject(req.params, {
        allowHtml: false,
        recurseObjects: true,
        recurseArrays: true
      });
    }
    
    // Sanitize specific headers
    if (scanHeaders && req.headers) {
      const headersToSanitize = [
        'user-agent',
        'referer',
        'origin'
      ];
      
      for (const header of headersToSanitize: any) {
        if (req.headers[header]) {
          req.headers[header] = customSanitizer 
            ? customSanitizer(req.headers[header]) 
            : encodeForHtml(req.headers[header]);
        }
      }
    }
    
    next();
  };
}

/**
 * Example usage for Express:
 * 
 * import express from 'express';
 * import { securityHeadersMiddleware, xssMiddleware } from './xss-prevention';
 * 
 * const app = express();
 * 
 * // Apply security headers
 * app.use(securityHeadersMiddleware());
 * 
 * // Apply XSS protection middleware for all routes
 * app.use(xssMiddleware());
 * 
 * // Rest of application
 */