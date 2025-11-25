const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', propertyController.getProperties);
router.get('/:id', propertyController.getProperty);

// Protected routes (require authentication)
router.post('/', authMiddleware, propertyController.createProperty);
router.put('/:id', authMiddleware, propertyController.updateProperty);
router.delete('/:id', authMiddleware, propertyController.deleteProperty);

module.exports = router;