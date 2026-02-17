const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const { validate, opportunitySchema } = require('../middlewares/validation');
const {
    createOpportunity,
    getOpportunities,
    getMyOpportunities,
    updateOpportunity,
    deleteOpportunity
} = require('../controllers/opportunityController');

// Protect all routes
router.use(auth);

// Create Opportunity (NGO/Admin only)
router.post(
    '/',
    authorizeRoles('ngo', 'admin'),
    validate(opportunitySchema),
    createOpportunity
);

// Get All Opportunities (Available to all authenticated users)
router.get('/', getOpportunities);

// Get My Opportunities (NGO/Admin only)
router.get(
    '/my',
    authorizeRoles('ngo', 'admin'),
    getMyOpportunities
);

// Update Opportunity (NGO/Admin only)
router.put(
    '/:id',
    authorizeRoles('ngo', 'admin'),
    updateOpportunity
);

// Delete Opportunity (NGO/Admin only)
router.delete(
    '/:id',
    authorizeRoles('ngo', 'admin'),
    deleteOpportunity
);

module.exports = router;
