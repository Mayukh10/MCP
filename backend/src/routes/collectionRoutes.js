import express from 'express';
import {
  createCollection,
  getMCPCollections,
  getPartnerCollections,
  getAvailableCollections,
  assignCollection,
  updateCollectionStatus,
  updateCollectionPrice,
} from '../controllers/collectionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// MCP routes
router.post('/', protect, authorize('mcp'), createCollection);
router.get('/mcp', protect, authorize('mcp'), getMCPCollections);
router.put('/:id/price', protect, authorize('mcp'), updateCollectionPrice);

// Pickup Partner routes
router.get('/partner', protect, authorize('pickup_partner'), getPartnerCollections);
router.get('/available', protect, authorize('pickup_partner'), getAvailableCollections);
router.put('/:id/assign', protect, authorize('pickup_partner'), assignCollection);
router.put('/:id/status', protect, updateCollectionStatus);

export default router; 