const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateRequest = require('../middleware/validateRequest');
const taskValidators = require('../validators/taskValidator');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.post('/', validateRequest(taskValidators.create), taskController.createTask);
router.put('/:id', validateRequest(taskValidators.update), taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;