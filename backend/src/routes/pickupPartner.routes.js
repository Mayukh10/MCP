const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const pickupPartnerController = require('../controllers/pickupPartner.controller');
const auth = require('../middleware/auth');
const roleCheck = require('../middleware/roleCheck');

/**
 * @swagger
 * /api/pickup-partners/dashboard:
 *   get:
 *     summary: Get pickup partner dashboard data
 *     tags: [Pickup Partner]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
 *       401:
 *         description: Unauthorized
 */
router.get('/dashboard', auth, roleCheck('pickup_partner'), pickupPartnerController.getDashboard);

/**
 * @swagger
 * /api/pickup-partners/orders:
 *   get:
 *     summary: Get assigned orders
 *     tags: [Pickup Partner]
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
router.get('/orders', auth, roleCheck('pickup_partner'), pickupPartnerController.getOrders);

/**
 * @swagger
 * /api/pickup-partners/orders/{id}/accept:
 *   post:
 *     summary: Accept assigned order
 *     tags: [Pickup Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order accepted successfully
 */
router.post('/orders/:id/accept', auth, roleCheck('pickup_partner'), pickupPartnerController.acceptOrder);

/**
 * @swagger
 * /api/pickup-partners/orders/{id}/pickup:
 *   post:
 *     summary: Mark order as picked up
 *     tags: [Pickup Partner]
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
 *               - location
 *             properties:
 *               location:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order marked as picked up
 */
router.post('/orders/:id/pickup',
  auth,
  roleCheck('pickup_partner'),
  [
    body('location').isObject().withMessage('Location is required'),
    body('notes').optional().isString()
  ],
  pickupPartnerController.pickupOrder
);

/**
 * @swagger
 * /api/pickup-partners/orders/{id}/deliver:
 *   post:
 *     summary: Mark order as delivered
 *     tags: [Pickup Partner]
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
 *               - location
 *             properties:
 *               location:
 *                 type: object
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Order marked as delivered
 */
router.post('/orders/:id/deliver',
  auth,
  roleCheck('pickup_partner'),
  [
    body('location').isObject().withMessage('Location is required'),
    body('notes').optional().isString()
  ],
  pickupPartnerController.deliverOrder
);

/**
 * @swagger
 * /api/pickup-partners/location:
 *   post:
 *     summary: Update current location
 *     tags: [Pickup Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - coordinates
 *             properties:
 *               coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *     responses:
 *       200:
 *         description: Location updated successfully
 */
router.post('/location',
  auth,
  roleCheck('pickup_partner'),
  [
    body('coordinates').isArray().withMessage('Coordinates are required'),
    body('coordinates.*').isFloat()
  ],
  pickupPartnerController.updateLocation
);

/**
 * @swagger
 * /api/pickup-partners/availability:
 *   post:
 *     summary: Update availability status
 *     tags: [Pickup Partner]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isAvailable
 *             properties:
 *               isAvailable:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Availability updated successfully
 */
router.post('/availability',
  auth,
  roleCheck('pickup_partner'),
  [body('isAvailable').isBoolean().withMessage('Availability status is required')],
  pickupPartnerController.updateAvailability
);

/**
 * @swagger
 * /api/pickup-partners/earnings:
 *   get:
 *     summary: Get earnings data
 *     tags: [Pickup Partner]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for earnings
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for earnings
 *     responses:
 *       200:
 *         description: Earnings data retrieved successfully
 */
router.get('/earnings', auth, roleCheck('pickup_partner'), pickupPartnerController.getEarnings);

module.exports = router; 