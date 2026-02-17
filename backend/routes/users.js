const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/auth');

router.get('/:id', userController.getProfile);
// protect update route
router.put('/:id', auth, userController.updateProfile);
router.put('/:id/password', auth, userController.changePassword);

module.exports = router;
