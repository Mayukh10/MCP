import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  mcp: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  pickupPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  wasteType: {
    type: String,
    enum: ['plastic', 'paper', 'metal', 'glass', 'e_waste', 'other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['kg', 'pieces'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    landmark: String
  },
  scheduledDate: {
    type: Date,
    required: true
  },
  notes: String,
  price: {
    type: Number,
    default: 0
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection; 