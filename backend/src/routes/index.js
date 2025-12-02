const express = require('express');
const router = express.Router();

const employeeRoutes = require('./employeeRoutes');
const taskRoutes = require('./taskRoutes');

router.use('/employees', employeeRoutes);
router.use('/tasks', taskRoutes);

module.exports = router;