const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const DashboardService = require('./dashboard.service');

class DashboardController {
  getStatistics = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getStatistics();
    responseHelper.success(res, 'Dashboard statistics fetched successfully.', stats);
  });

  getRecentMessages = asyncHandler(async (req, res) => {
    const messages = await DashboardService.getRecentMessages();
    responseHelper.success(res, 'Recent messages fetched successfully.', messages);
  });

  getUnreadMessagesCount = asyncHandler(async (req, res) => {
    const count = await DashboardService.getUnreadMessagesCount();
    responseHelper.success(res, 'Unread messages count fetched successfully.', { count });
  });

  getRecentActivity = asyncHandler(async (req, res) => {
    const activity = await DashboardService.getRecentActivity();
    responseHelper.success(res, 'Recent activity fetched successfully.', activity);
  });

  getWeeklyActivityStats = asyncHandler(async (req, res) => {
    const stats = await DashboardService.getWeeklyActivityStats();
    responseHelper.success(res, 'Weekly activity stats fetched successfully.', stats);
  });
}

module.exports = new DashboardController();
