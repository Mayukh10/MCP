import express from 'express';
import {
  getMCPTransactions,
  getPartnerTransactions,
  updateTransactionPayment,
  getTransactionSummary,
} from '../controllers/transactionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// MCP routes
router.get('/mcp', protect, authorize('mcp'), getMCPTransactions);

// Pickup Partner routes
router.get('/partner', protect, authorize('pickup_partner'), getPartnerTransactions);

// Common routes
router.put('/:id/payment', updateTransactionPayment);
router.get('/summary', protect, getTransactionSummary);

export default router; 