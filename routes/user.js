const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/register', userController.register);
router.get('/users', userController.listUsers);
router.get('/users/:id', userController.getUser);

module.exports = router; 