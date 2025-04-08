const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const mcpController = require('../controllers/mcp.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/mcp/dashboard:
 *   get:
 *     summary: Get MCP dashboard data
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', auth, roleCheck('mcp'), mcpController.getDashboard);

/**
 * @swagger
 * /api/mcp/pickup-partners:
 *   get:
 *     summary: Get all pickup partners
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Pickup partners retrieved successfully
 */
router.get('/pickup-partners', auth, roleCheck('mcp'), mcpController.getPickupPartners);

/**
 * @swagger
 * /api/mcp/pickup-partners:
 *   post:
 *     summary: Add new pickup partner
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - commissionRate
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               commissionRate:
 *                 type: number
 *     responses:
 *       201:
 *         description: Pickup partner added successfully
 */
router.post('/pickup-partners',
  auth,
  roleCheck('mcp'),
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please enter a valid email'),
    body('phone').trim().notEmpty().withMessage('Phone number is required'),
    body('commissionRate').isFloat({ min: 0, max: 100 }).withMessage('Commission rate must be between 0 and 100')
  ],
  mcpController.addPickupPartner
);

/**
 * @swagger
 * /api/mcp/pickup-partners/{id}:
 *   put:
 *     summary: Update pickup partner details
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               commissionRate:
 *                 type: number
 *               status:
 *                 type: string
 *                 enum: [active, inactive, suspended]
 *     responses:
 *       200:
 *         description: Pickup partner updated successfully
 */
router.put('/pickup-partners/:id',
  auth,
  roleCheck('mcp'),
  [
    body('commissionRate').optional().isFloat({ min: 0, max: 100 }).withMessage('Commission rate must be between 0 and 100'),
    body('status').optional().isIn(['active', 'inactive', 'suspended']).withMessage('Invalid status')
  ],
  mcpController.updatePickupPartner
);

/**
 * @swagger
 * /api/mcp/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by order status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: Orders retrieved successfully
 */
router.get('/orders', auth, roleCheck('mcp'), mcpController.getOrders);

/**
 * @swagger
 * /api/mcp/orders:
 *   post:
 *     summary: Create new order
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupAddress
 *               - deliveryAddress
 *               - customerDetails
 *               - packageDetails
 *               - paymentDetails
 *             properties:
 *               pickupAddress:
 *                 type: object
 *               deliveryAddress:
 *                 type: object
 *               customerDetails:
 *                 type: object
 *               packageDetails:
 *                 type: object
 *               paymentDetails:
 *                 type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 */
router.post('/orders',
  auth,
  roleCheck('mcp'),
  [
    body('pickupAddress').isObject().withMessage('Pickup address is required'),
    body('deliveryAddress').isObject().withMessage('Delivery address is required'),
    body('customerDetails').isObject().withMessage('Customer details are required'),
    body('packageDetails').isObject().withMessage('Package details are required'),
    body('paymentDetails').isObject().withMessage('Payment details are required')
  ],
  mcpController.createOrder
);

/**
 * @swagger
 * /api/mcp/orders/{id}/assign:
 *   post:
 *     summary: Assign order to pickup partner
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pickupPartnerId
 *             properties:
 *               pickupPartnerId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order assigned successfully
 */
router.post('/orders/:id/assign',
  auth,
  roleCheck('mcp'),
  [body('pickupPartnerId').notEmpty().withMessage('Pickup partner ID is required')],
  mcpController.assignOrder
);

/**
 * @swagger
 * /api/mcp/analytics:
 *   get:
 *     summary: Get analytics data
 *     tags: [MCP]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for analytics
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for analytics
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 */
router.get('/analytics', auth, roleCheck('mcp'), mcpController.getAnalytics);

module.exports = router; 