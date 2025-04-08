const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['mcp', 'pickup_partner'],
    required: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'suspended'],
    default: 'active'
  },
  // MCP specific fields
  companyName: {
    type: String,
    trim: true
  },
  businessAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  // Pickup Partner specific fields
  mcpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  commissionRate: {
    type: Number,
    min: 0,
    max: 100
  },
  fixedPayment: {
    type: Number,
    min: 0
  },
  currentLocation: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  isAvailable: {
    type: Boolean,
    default: false
  },
  documents: [{
    type: {
      type: String,
      enum: ['id_proof', 'address_proof', 'vehicle_document']
    },
    url: String,
    verified: {
      type: Boolean,
      default: false
    }
  }],
  deviceToken: {
    type: String
  }
}, {
  timestamps: true
});

// Index for geospatial queries
userSchema.index({ currentLocation: '2dsphere' });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 