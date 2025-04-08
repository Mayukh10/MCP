const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  reference: {
    type: String,
    required: true
  },
  referenceType: {
    type: String,
    enum: ['order', 'transfer', 'deposit', 'withdrawal'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  metadata: {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    fromWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet'
    },
    toWallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet'
    },
    razorpayPaymentId: String,
    razorpayOrderId: String
  }
}, {
  timestamps: true
});

const walletSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  balance: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  transactions: [transactionSchema],
  status: {
    type: String,
    enum: ['active', 'suspended'],
    default: 'active'
  },
  lastTransaction: {
    type: Date
  }
}, {
  timestamps: true
});

// Method to add transaction
walletSchema.methods.addTransaction = async function(transaction) {
  this.transactions.push(transaction);
  this.lastTransaction = new Date();

  if (transaction.status === 'completed') {
    if (transaction.type === 'credit') {
      this.balance += transaction.amount;
    } else {
      this.balance -= transaction.amount;
    }
  }

  return this.save();
};

// Method to get transaction history
walletSchema.methods.getTransactionHistory = function(options = {}) {
  const {
    startDate,
    endDate,
    type,
    status,
    limit = 10,
    page = 1
  } = options;

  let query = this.transactions;

  if (startDate) {
    query = query.filter(t => t.createdAt >= startDate);
  }

  if (endDate) {
    query = query.filter(t => t.createdAt <= endDate);
  }

  if (type) {
    query = query.filter(t => t.type === type);
  }

  if (status) {
    query = query.filter(t => t.status === status);
  }

  const start = (page - 1) * limit;
  const end = start + limit;

  return {
    transactions: query.slice(start, end),
    total: query.length,
    page,
    totalPages: Math.ceil(query.length / limit)
  };
};

// Method to transfer funds
walletSchema.methods.transferFunds = async function(toWallet, amount, description) {
  if (this.balance < amount) {
    throw new Error('Insufficient funds');
  }

  const transaction = {
    type: 'debit',
    amount,
    description,
    reference: `TRF${Date.now()}`,
    referenceType: 'transfer',
    metadata: {
      toWallet: toWallet._id
    }
  };

  await this.addTransaction(transaction);

  const toTransaction = {
    type: 'credit',
    amount,
    description: `Transfer from ${this.userId}`,
    reference: transaction.reference,
    referenceType: 'transfer',
    metadata: {
      fromWallet: this._id
    }
  };

  await toWallet.addTransaction(toTransaction);

  return transaction;
};

const Wallet = mongoose.model('Wallet', walletSchema);

module.exports = Wallet; 