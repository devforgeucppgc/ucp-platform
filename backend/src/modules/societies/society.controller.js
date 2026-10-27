const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const SocietyService = require('./society.service');

class SocietyController {
  getAllSocieties = asyncHandler(async (req, res) => {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 10,
      search: req.query.search,
      sort: req.query.sort,
    };
    const result = await SocietyService.getAllSocieties(options);
    responseHelper.success(res, 'Societies fetched successfully.', result);
  });

  getSociety = asyncHandler(async (req, res) => {
    const { identifier } = req.params;
    const society = await SocietyService.getSocietyByIdOrSlug(identifier);
    responseHelper.success(res, 'Society fetched successfully.', society);
  });

  createSociety = asyncHandler(async (req, res) => {
    const data = { ...req.body };
    const members = data.teamMembers || data.team || [];
    data.teamMembers = members;
    data.team = members;
    const newSociety = await SocietyService.createSociety(data);
    responseHelper.success(res, 'Society created successfully.', newSociety, 201);
  });

  updateSociety = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = { ...req.body };
    if (data.team || data.teamMembers) {
      const members = data.teamMembers || data.team || [];
      data.teamMembers = members;
      data.team = members;
    }
    const updatedSociety = await SocietyService.updateSociety(id, data);
    responseHelper.success(res, 'Society updated successfully.', updatedSociety);
  });

  deleteSociety = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await SocietyService.deleteSociety(id);
    responseHelper.success(res, 'Society deleted successfully.', null, 204);
  });
}

module.exports = new SocietyController();
