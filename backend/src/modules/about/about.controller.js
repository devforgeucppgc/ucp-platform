const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const AboutService = require('./about.service');

class AboutController {
  getAbout = asyncHandler(async (req, res) => {
    const data = await AboutService.getAboutContent();
    responseHelper.success(res, 'About page content fetched successfully.', data);
  });

  // --- Singleton Sections ---
  updateHero = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) data.image = req.fileUrl;
    const result = await AboutService.updateHero(data);
    responseHelper.success(res, 'About hero section updated successfully.', result);
  });

  updateIntroduction = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) data.image = req.fileUrl;
    const result = await AboutService.updateIntroduction(data);
    responseHelper.success(res, 'About introduction section updated successfully.', result);
  });

  updateStatistics = asyncHandler(async (req, res) => {
    const result = await AboutService.updateStatistics(req.body);
    responseHelper.success(res, 'About statistics section updated successfully.', result);
  });

  // --- Timeline ---
  getTimeline = asyncHandler(async (req, res) => {
    const timeline = await AboutService.getTimeline();
    responseHelper.success(res, 'Timeline fetched successfully.', timeline);
  });

  createTimelineItem = asyncHandler(async (req, res) => {
    const newItem = await AboutService.createTimelineItem(req.body);
    responseHelper.success(res, 'Timeline item created successfully.', newItem, 201);
  });

  updateTimelineItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedItem = await AboutService.updateTimelineItem(id, req.body);
    responseHelper.success(res, 'Timeline item updated successfully.', updatedItem);
  });

  deleteTimelineItem = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AboutService.deleteTimelineItem(id);
    responseHelper.success(res, 'Timeline item deleted successfully.', null, 204);
  });

  // --- Leaders ---
  getLeaders = asyncHandler(async (req, res) => {
    const leaders = await AboutService.getLeaders();
    responseHelper.success(res, 'Leaders fetched successfully.', leaders);
  });

  createLeader = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) data.image = req.fileUrl;
    const newLeader = await AboutService.createLeader(data);
    responseHelper.success(res, 'Leader created successfully.', newLeader, 201);
  });

  updateLeader = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    if (req.fileUrl) data.image = req.fileUrl;
    const updatedLeader = await AboutService.updateLeader(id, data);
    responseHelper.success(res, 'Leader updated successfully.', updatedLeader);
  });

  deleteLeader = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AboutService.deleteLeader(id);
    responseHelper.success(res, 'Leader deleted successfully.', null, 204);
  });

  // --- Values ---
  getValues = asyncHandler(async (req, res) => {
    const values = await AboutService.getValues();
    responseHelper.success(res, 'Values fetched successfully.', values);
  });

  createValue = asyncHandler(async (req, res) => {
    const newValue = await AboutService.createValue(req.body);
    responseHelper.success(res, 'Value created successfully.', newValue, 201);
  });

  updateValue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedValue = await AboutService.updateValue(id, req.body);
    responseHelper.success(res, 'Value updated successfully.', updatedValue);
  });

  deleteValue = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AboutService.deleteValue(id);
    responseHelper.success(res, 'Value deleted successfully.', null, 204);
  });
}

module.exports = new AboutController();