const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const authorizeRoles = require('../middlewares/role');
const { validate, opportunitySchema } = require('../middlewares/validation');

const {
  createOpportunity,
  getOpportunities,
  getOpportunityById,
  getMyOpportunities,
  updateOpportunity,
  deleteOpportunity,
  applyToOpportunity,
  getAppliedOpportunities,
  getOpportunityApplicants,
  searchOpportunities
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

// Get All Opportunities
router.get('/', getOpportunities);

// Search Opportunities (IMPORTANT: before /:id)
router.get('/search', searchOpportunities);

// Get Applied Opportunities
router.get(
  '/applied',
  authorizeRoles('volunteer'),
  getAppliedOpportunities
);

// Get My Opportunities
router.get(
  '/my',
  authorizeRoles('ngo', 'admin'),
  getMyOpportunities
);

// Get single opportunity
router.get('/:id', getOpportunityById);

// Update Opportunity
router.put(
  '/:id',
  authorizeRoles('ngo', 'admin'),
  updateOpportunity
);

// Delete Opportunity
router.delete(
  '/:id',
  authorizeRoles('ngo', 'admin'),
  deleteOpportunity
);

// Apply for Opportunity
router.post(
  '/:id/apply',
  authorizeRoles('volunteer'),
  applyToOpportunity
);

// Get Applicants
router.get(
  '/:id/applicants',
  authorizeRoles('ngo', 'admin'),
  getOpportunityApplicants
);

module.exports = router;