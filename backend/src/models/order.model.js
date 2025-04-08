const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  mcpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupPartnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: [
      'pending',
      'assigned',
      'accepted',
      'picked_up',
      'delivered',
      'cancelled',
      'failed'
    ],
    default: 'pending'
  },
  pickupAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true
      }
    }
  },
  customerDetails: {
    name: String,
    phone: String,
    email: String
  },
  packageDetails: {
    type: String,
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    },
    specialInstructions: String
  },
  paymentDetails: {
    amount: {
      type: Number,
      required: true
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online'],
      default: 'cash'
    },
    razorpayOrderId: String,
    razorpayPaymentId: String
  },
  commission: {
    amount: Number,
    percentage: Number
  },
  timeline: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number]
    },
    notes: String
  }],
  estimatedPickupTime: Date,
  estimatedDeliveryTime: Date,
  actualPickupTime: Date,
  actualDeliveryTime: Date,
  cancellationReason: String,
  failureReason: String,
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String
  }
}, {
  timestamps: true
});

// Indexes for geospatial queries
orderSchema.index({ 'pickupAddress.coordinates': '2dsphere' });
orderSchema.index({ 'deliveryAddress.coordinates': '2dsphere' });

// Method to update order status
orderSchema.methods.updateStatus = async function(newStatus, location, notes) {
  this.status = newStatus;
  this.timeline.push({
    status: newStatus,
    location,
    notes
  });

  // Update relevant timestamps based on status
  switch (newStatus) {
    case 'picked_up':
      this.actualPickupTime = new Date();
      break;
    case 'delivered':
      this.actualDeliveryTime = new Date();
      break;
  }

  return this.save();
};

// Static method to generate order number
orderSchema.statics.generateOrderNumber = function() {
  const date = new Date();
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `ORD${year}${month}${day}${random}`;
};

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 