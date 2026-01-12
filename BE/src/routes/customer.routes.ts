import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';
import {
  validateCustomerCreate,
  validateCustomerUpdate,
} from '../middleware/validation.middleware';

const router = Router();
const customerController = new CustomerController();

// GET /api/customers - List all customers with optional filters
router.get('/', (req, res, next) => customerController.getAll(req, res, next));

// GET /api/customers/:id - Get customer by ID
router.get('/:id', (req, res, next) => customerController.getById(req, res, next));

// POST /api/customers - Create new customer
router.post(
  '/',
  validateCustomerCreate,
  (req, res, next) => customerController.create(req, res, next)
);

// PUT /api/customers/:id - Update customer
router.put(
  '/:id',
  validateCustomerUpdate,
  (req, res, next) => customerController.update(req, res, next)
);

// DELETE /api/customers/:id - Delete customer
router.delete('/:id', (req, res, next) => customerController.delete(req, res, next));

export default router;
