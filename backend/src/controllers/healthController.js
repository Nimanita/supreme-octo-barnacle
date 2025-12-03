const mongoose = require('mongoose');

const healthController = {
  // GET /api/health
  checkHealth: (req, res) => {
    const health = {
      ok: true,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
    };
    
    res.json(health);
  }
};

module.exports = healthController;