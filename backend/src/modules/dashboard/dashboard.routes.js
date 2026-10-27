const express = require('express');
const router = express.Router();
const DashboardController = require('./dashboard.controller');
const { protect } = require('../../middleware/auth.middleware');

// All dashboard routes are protected
router.use(protect);

router.get('/statistics', DashboardController.getStatistics);
router.get('/messages', DashboardController.getRecentMessages);
router.get('/messages/count', DashboardController.getUnreadMessagesCount);
router.get('/activity', DashboardController.getRecentActivity);
router.get('/weekly-stats', DashboardController.getWeeklyActivityStats);

module.exports = router;
