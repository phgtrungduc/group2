import { Router } from 'express';
import customerRoutes from './customer.routes';

const router = Router();

// API routes
router.use('/customers', customerRoutes);

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

export default router;
