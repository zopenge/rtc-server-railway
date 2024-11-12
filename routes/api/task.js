const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/task');
const authMiddleware = require('../../middleware/auth');

router.use(authMiddleware);

router.get('/', taskController.getTasks);
router.post('/', taskController.createTask);
router.put('/:id', taskController.updateTask);
router.get('/:id', taskController.getTask);

module.exports = router; 