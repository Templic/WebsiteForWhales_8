/**
 * Security Routes Index
 * 
 * This file aggregates and exports all security-related routes.
 */

import { Router } from 'express';
import dashboardRoutes from './dashboard';

// Create a router for all security routes
const securityRouter = Router();

// Use dashboard routes
securityRouter.use('/dashboard', dashboardRoutes);

// Export the security router
export default securityRouter;