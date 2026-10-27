// campus.controller.js
const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const CampusService = require('./campus.service');

class CampusController {
  // GET - Fetch campus information
  getCampusInformation = asyncHandler(async (req, res) => {
    const info = await CampusService.getCampusInformation();
    responseHelper.success(res, 'Campus information fetched successfully.', info);
  });

  // POST - Create new campus information
  createCampusInformation = asyncHandler(async (req, res) => {
    const createdInfo = await CampusService.createCampusInformation(req.body);
    responseHelper.success(res, 'Campus information created successfully.', createdInfo, 201);
  });

  // PUT - Update existing campus information
  updateCampusInformation = asyncHandler(async (req, res) => {
    const updatedInfo = await CampusService.updateCampusInformation(req.body);
    responseHelper.success(res, 'Campus information updated successfully.', updatedInfo);
  });

  // DELETE - Remove campus information
  deleteCampusInformation = asyncHandler(async (req, res) => {
    await CampusService.deleteCampusInformation();
    responseHelper.success(res, 'Campus information deleted successfully.');
  });
}

module.exports = new CampusController();