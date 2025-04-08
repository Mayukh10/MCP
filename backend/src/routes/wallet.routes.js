const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const walletController = require('../controllers/wallet.controller');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/wallets/balance:
 *   get:
 *     summary: Get wallet balance
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wallet balance retrieved successfully
 */
router.get('/balance', auth, walletController.getBalance);

/**
 * @swagger
 * /api/wallets/transactions:
 *   get:
 *     summary: Get transaction history
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [credit, debit]
 *         description: Filter by transaction type
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for transactions
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for transactions
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
 *         description: Transaction history retrieved successfully
 */
router.get('/transactions', auth, walletController.getTransactions);

/**
 * @swagger
 * /api/wallets/deposit:
 *   post:
 *     summary: Deposit funds to wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *               paymentMethod:
 *                 type: string
 *                 enum: [online, cash]
 *     responses:
 *       200:
 *         description: Deposit initiated successfully
 */
router.post('/deposit',
  auth,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
    body('paymentMethod').isIn(['online', 'cash']).withMessage('Invalid payment method')
  ],
  walletController.deposit
);

/**
 * @swagger
 * /api/wallets/withdraw:
 *   post:
 *     summary: Withdraw funds from wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - bankDetails
 *             properties:
 *               amount:
 *                 type: number
 *               bankDetails:
 *                 type: object
 *     responses:
 *       200:
 *         description: Withdrawal initiated successfully
 */
router.post('/withdraw',
  auth,
  [
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
    body('bankDetails').isObject().withMessage('Bank details are required')
  ],
  walletController.withdraw
);

/**
 * @swagger
 * /api/wallets/transfer:
 *   post:
 *     summary: Transfer funds between wallets
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - toUserId
 *               - amount
 *             properties:
 *               toUserId:
 *                 type: string
 *               amount:
 *                 type: number
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transfer initiated successfully
 */
router.post('/transfer',
  auth,
  [
    body('toUserId').notEmpty().withMessage('Recipient user ID is required'),
    body('amount').isFloat({ min: 0 }).withMessage('Amount must be greater than 0'),
    body('description').optional().isString()
  ],
  walletController.transfer
);

/**
 * @swagger
 * /api/wallets/verify-payment:
 *   post:
 *     summary: Verify Razorpay payment
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - razorpay_payment_id
 *               - razorpay_order_id
 *               - razorpay_signature
 *             properties:
 *               razorpay_payment_id:
 *                 type: string
 *               razorpay_order_id:
 *                 type: string
 *               razorpay_signature:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment verified successfully
 */
router.post('/verify-payment',
  auth,
  [
    body('razorpay_payment_id').notEmpty().withMessage('Payment ID is required'),
    body('razorpay_order_id').notEmpty().withMessage('Order ID is required'),
    body('razorpay_signature').notEmpty().withMessage('Signature is required')
  ],
  walletController.verifyPayment
);

/**
 * @swagger
 * /api/wallets/statement:
 *   get:
 *     summary: Get wallet statement
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for statement
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for statement
 *     responses:
 *       200:
 *         description: Wallet statement retrieved successfully
 */
router.get('/statement', auth, walletController.getStatement);

module.exports = router; 