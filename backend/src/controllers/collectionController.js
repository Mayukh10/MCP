import Collection from '../models/Collection.js';
import Transaction from '../models/Transaction.js';

// @desc    Create new collection request
// @route   POST /api/collections
// @access  Private (MCP only)
export const createCollection = async (req, res) => {
  try {
    const collection = await Collection.create({
      ...req.body,
      mcp: req.user._id,
    });

    res.status(201).json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get collections for MCP
// @route   GET /api/collections/mcp
// @access  Private (MCP only)
export const getMCPCollections = async (req, res) => {
  try {
    const collections = await Collection.find({ mcp: req.user._id })
      .populate('pickupPartner', 'name phone')
      .sort('-createdAt');

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get collections for pickup partner
// @route   GET /api/collections/partner
// @access  Private (Pickup Partner only)
export const getPartnerCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      pickupPartner: req.user._id,
    })
      .populate('mcp', 'name phone')
      .sort('-createdAt');

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get available collections for pickup
// @route   GET /api/collections/available
// @access  Private (Pickup Partner only)
export const getAvailableCollections = async (req, res) => {
  try {
    const collections = await Collection.find({
      status: 'pending',
      pickupPartner: { $exists: false },
    })
      .populate('mcp', 'name phone')
      .sort('-createdAt');

    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Assign pickup partner to collection
// @route   PUT /api/collections/:id/assign
// @access  Private (Pickup Partner only)
export const assignCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.status !== 'pending') {
      return res.status(400).json({ message: 'Collection is not available for pickup' });
    }

    collection.pickupPartner = req.user._id;
    collection.status = 'assigned';
    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update collection status
// @route   PUT /api/collections/:id/status
// @access  Private
export const updateCollectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Validate status transition
    const validTransitions = {
      assigned: ['in_progress', 'cancelled'],
      in_progress: ['completed', 'cancelled'],
    };

    if (!validTransitions[collection.status]?.includes(status)) {
      return res.status(400).json({ message: 'Invalid status transition' });
    }

    collection.status = status;
    await collection.save();

    // If collection is completed, create transaction
    if (status === 'completed') {
      await Transaction.create({
        collection: collection._id,
        mcp: collection.mcp,
        pickupPartner: collection.pickupPartner,
        amount: collection.price,
        type: 'payment',
        status: 'pending',
        paymentMethod: 'cash', // Default to cash, can be updated later
      });
    }

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update collection price
// @route   PUT /api/collections/:id/price
// @access  Private (MCP only)
export const updateCollectionPrice = async (req, res) => {
  try {
    const { price } = req.body;
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    if (collection.mcp.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    collection.price = price;
    await collection.save();

    res.json(collection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 