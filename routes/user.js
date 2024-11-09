const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');

router.post('/login', userController.login);
router.post('/register', userController.createUser);
router.get('/users', userController.listUsers);
router.get('/users/:id', userController.getUser);
router.post('/logout', userController.logout);

module.exports = router; 