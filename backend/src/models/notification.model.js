const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: [
      'order_assigned',
      'order_accepted',
      'order_completed',
      'order_cancelled',
      'payment_received',
      'wallet_updated',
      'system_alert'
    ],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  read: {
    type: Boolean,
    default: false
  },
  data: {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    },
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet'
    },
    amount: Number,
    status: String
  },
  action: {
    type: String,
    enum: ['view_order', 'view_wallet', 'none'],
    default: 'none'
  }
}, {
  timestamps: true
});

// Index for faster queries
notificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function(userId, title, message, type, options = {}) {
  const notification = new this({
    userId,
    title,
    message,
    type,
    priority: options.priority || 'medium',
    data: options.data || {},
    action: options.action || 'none'
  });

  return notification.save();
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function(userId, notificationIds) {
  return this.updateMany(
    {
      userId,
      _id: { $in: notificationIds },
      read: false
    },
    { $set: { read: true } }
  );
};

// Static method to get unread notifications count
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({ userId, read: false });
};

// Static method to get user notifications with pagination
notificationSchema.statics.getUserNotifications = async function(userId, options = {}) {
  const {
    page = 1,
    limit = 20,
    read,
    type
  } = options;

  const query = { userId };

  if (read !== undefined) {
    query.read = read;
  }

  if (type) {
    query.type = type;
  }

  const notifications = await this.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('data.orderId', 'orderNumber status')
    .populate('data.walletId', 'balance');

  const total = await this.countDocuments(query);

  return {
    notifications,
    pagination: {
      total,
      page,
      totalPages: Math.ceil(total / limit)
    }
  };
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification; 