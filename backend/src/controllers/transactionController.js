import Transaction from '../models/Transaction.js';
import Collection from '../models/Collection.js';

// @desc    Get transactions for MCP
// @route   GET /api/transactions/mcp
// @access  Private (MCP only)
export const getMCPTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ mcp: req.user._id })
      .populate('collection', 'wasteType quantity unit')
      .populate('pickupPartner', 'name phone')
      .sort('-createdAt');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transactions for pickup partner
// @route   GET /api/transactions/partner
// @access  Private (Pickup Partner only)
export const getPartnerTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      pickupPartner: req.user._id,
    })
      .populate('collection', 'wasteType quantity unit')
      .populate('mcp', 'name phone')
      .sort('-createdAt');

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update transaction payment details
// @route   PUT /api/transactions/:id/payment
// @access  Private
export const updateTransactionPayment = async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate payment method
    if (!['cash', 'upi', 'bank_transfer'].includes(paymentMethod)) {
      return res.status(400).json({ message: 'Invalid payment method' });
    }

    transaction.paymentMethod = paymentMethod;
    transaction.paymentDetails = paymentDetails;
    transaction.status = 'completed';
    await transaction.save();

    // Update collection payment status
    await Collection.findByIdAndUpdate(transaction.collection, {
      paymentStatus: 'completed',
    });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get transaction summary
// @route   GET /api/transactions/summary
// @access  Private
export const getTransactionSummary = async (req, res) => {
  try {
    const query = req.user.role === 'mcp' 
      ? { mcp: req.user._id }
      : { pickupPartner: req.user._id };

    const transactions = await Transaction.find({
      ...query,
      status: 'completed',
    });

    const summary = {
      totalTransactions: transactions.length,
      totalAmount: transactions.reduce((sum, t) => sum + t.amount, 0),
      byPaymentMethod: transactions.reduce((acc, t) => {
        acc[t.paymentMethod] = (acc[t.paymentMethod] || 0) + t.amount;
        return acc;
      }, {}),
      byType: transactions.reduce((acc, t) => {
        acc[t.type] = (acc[t.type] || 0) + t.amount;
        return acc;
      }, {}),
    };

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 