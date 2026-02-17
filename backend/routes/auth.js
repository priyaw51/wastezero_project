const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

const { validate, registerSchema, loginSchema } = require('../middlewares/validation');

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
