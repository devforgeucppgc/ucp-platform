const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const HomeService = require('./home.service');

class HomeController {
  getHome = asyncHandler(async (req, res) => {
    const data = await HomeService.getHomeContent();
    return responseHelper.success(res, 'Home content fetched successfully.', data);
  });

  getHero = asyncHandler(async (req, res) => {
    const hero = await HomeService.getHero();
    return responseHelper.success(res, 'Hero section fetched successfully.', hero);
  });

  getAbout = asyncHandler(async (req, res) => {
    const about = await HomeService.getAbout();
    return responseHelper.success(res, 'About section fetched successfully.', about);
  });

  getStats = asyncHandler(async (req, res) => {
    const stats = await HomeService.getStats();
    return responseHelper.success(res, 'Statistics fetched successfully.', stats);
  });

  getVideo = asyncHandler(async (req, res) => {
    const video = await HomeService.getVideo();
    return responseHelper.success(res, 'Promotional video fetched successfully.', video);
  });

  updateHero = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) {
      data.heroImage = req.fileUrl;
    }
    const result = await HomeService.updateHero(data);
    return responseHelper.success(res, 'Hero section updated successfully.', result);
  });

  updateAbout = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) {
      data.image = req.fileUrl;
    }
    const result = await HomeService.updateAbout(data);
    return responseHelper.success(res, 'About section updated successfully.', result);
  });

  updateStats = asyncHandler(async (req, res) => {
    const result = await HomeService.updateStats(req.body);
    return responseHelper.success(res, 'Statistics updated successfully.', result);
  });

  updateVideo = asyncHandler(async (req, res) => {
    const data = req.body;
    if (req.fileUrl) {
      data.videoUrl = req.fileUrl;
    }
    const result = await HomeService.updateVideo(data);
    return responseHelper.success(res, 'Promotional video updated successfully.', result);
  });
}

module.exports = new HomeController();
