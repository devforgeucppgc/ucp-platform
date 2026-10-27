const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const AnnouncementService = require('./announcement.service');

class AnnouncementController {
  // --- Announcements ---
  getAllAnnouncements = asyncHandler(async (req, res) => {
    const result = await AnnouncementService.getAllAnnouncements(req.query);
    responseHelper.success(res, 'Announcements fetched successfully.', result);
  });

  getAnnouncementById = asyncHandler(async (req, res) => {
    const announcement = await AnnouncementService.getAnnouncementById(req.params.id);
    responseHelper.success(res, 'Announcement fetched successfully.', announcement);
  });

  createAnnouncement = asyncHandler(async (req, res) => {
    const newAnnouncement = await AnnouncementService.createAnnouncement(req.body);
    responseHelper.success(res, 'Announcement created successfully.', newAnnouncement, 201);
  });

  updateAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedAnnouncement = await AnnouncementService.updateAnnouncement(id, req.body);
    responseHelper.success(res, 'Announcement updated successfully.', updatedAnnouncement);
  });

  deleteAnnouncement = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AnnouncementService.deleteAnnouncement(id);
    responseHelper.success(res, 'Announcement deleted successfully.', null, 204);
  });

  // --- Events ---
  getAllEvents = asyncHandler(async (req, res) => {
    const result = await AnnouncementService.getAllEvents(req.query);
    responseHelper.success(res, 'Events fetched successfully.', result);
  });

  getEventById = asyncHandler(async (req, res) => {
    const event = await AnnouncementService.getEventById(req.params.id);
    responseHelper.success(res, 'Event fetched successfully.', event);
  });

  createEvent = asyncHandler(async (req, res) => {
    const newEvent = await AnnouncementService.createEvent(req.body);
    responseHelper.success(res, 'Event created successfully.', newEvent, 201);
  });

  updateEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updatedEvent = await AnnouncementService.updateEvent(id, req.body);
    responseHelper.success(res, 'Event updated successfully.', updatedEvent);
  });

  deleteEvent = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await AnnouncementService.deleteEvent(id);
    responseHelper.success(res, 'Event deleted successfully.', null, 204);
  });
}

module.exports = new AnnouncementController();
