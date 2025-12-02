const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const validateRequest = require('../middleware/validateRequest');
const employeeValidators = require('../validators/employeeValidator');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', validateRequest(employeeValidators.create), employeeController.createEmployee);
router.put('/:id', validateRequest(employeeValidators.update), employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;