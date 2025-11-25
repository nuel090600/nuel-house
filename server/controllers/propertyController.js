const Property = require('../models/Property');

// @desc    Get all properties
// @route   GET /api/properties
// @access  Public
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find().populate('owner', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: {
        properties
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('owner', 'firstName lastName email');
    
    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        property
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
exports.createProperty = async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      owner: req.user.id // From auth middleware
    };

    const property = await Property.create(propertyData);

    res.status(201).json({
      status: 'success',
      message: 'Property created successfully',
      data: {
        property
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error creating property',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
exports.updateProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Property updated successfully',
      data: {
        property
      }
    });
  } catch (error) {
    res.status(400).json({
      status: 'error',
      message: 'Error updating property',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({
        status: 'fail',
        message: 'Property not found'
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error deleting property',
      error: error.message
    });
  }
};

exports.getProperties = async (req, res) => {
  try {
    const { location, type, bedrooms } = req.query;
    let filter = {};
    
    // Add search filters if provided
    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // Case-insensitive search
    }
    if (type) {
      filter.type = { $regex: type, $options: 'i' };
    }
    if (bedrooms) {
      filter.bedrooms = parseInt(bedrooms);
    }
    
    const properties = await Property.find(filter).populate('owner', 'firstName lastName email');
    
    res.status(200).json({
      status: 'success',
      results: properties.length,
      data: {
        properties
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error fetching properties',
      error: error.message
    });
  }
};