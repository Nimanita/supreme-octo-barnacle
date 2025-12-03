const express = require('express');
const router = express.Router();

const employeeRoutes = require('./employeeRoutes');
const taskRoutes = require('./taskRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const healthRoutes = require('./healthRoutes');

router.use('/employees', employeeRoutes);
router.use('/tasks', taskRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/health', healthRoutes);

module.exports = router;