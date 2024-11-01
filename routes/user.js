const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.get('/users', userController.listUsers);
router.get('/users/:id', userController.getUser);

module.exports = router; 