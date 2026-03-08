const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

// Pública
router.post('/login', authController.login);

// Protegidas — exige JWT
router.post('/register', authMiddleware, authController.register);
router.get('/me', authMiddleware, authController.me);
router.get('/usuarios', authMiddleware, authController.listarUsuarios);

module.exports = router;