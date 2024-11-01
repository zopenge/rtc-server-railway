const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');

router.post('/connect', authController.connect);
router.post('/disconnect', authController.disconnect);

module.exports = router;