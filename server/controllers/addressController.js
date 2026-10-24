const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.json({ success: true, addresses });
  } catch (error) {
    next(error);
  }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res, next) => {
  try {
    const { fullName, phone, house, street, locality, city, state, pincode, landmark, latitude, longitude, isDefault } = req.body;

    if (!fullName || !phone || !house || !street || !city || !state || !pincode) {
      return res.status(400).json({ success: false, message: 'Please provide all required address fields.' });
    }

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const addressCount = await Address.countDocuments({ user: req.user._id });

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      house,
      street,
      locality: locality || '',
      city,
      state,
      pincode,
      landmark: landmark || '',
      latitude: latitude || 28.6139,
      longitude: longitude || 77.2090,
      isDefault: isDefault || addressCount === 0,
    });

    res.status(201).json({ success: true, message: 'Address saved successfully!', address });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res, next) => {
  try {
    let address = await Address.findOne({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, req.body);
    await address.save();

    res.json({ success: true, message: 'Address updated successfully!', address });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res, next) => {
  try {
    const address = await Address.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }
    res.json({ success: true, message: 'Address deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res, next) => {
  try {
    await Address.updateMany({ user: req.user._id }, { isDefault: false });
    const address = await Address.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { isDefault: true },
      { new: true }
    );
    res.json({ success: true, message: 'Default address updated.', address });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
};
