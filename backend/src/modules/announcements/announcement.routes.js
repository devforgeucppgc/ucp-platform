const express = require('express');
const router = express.Router();
const AnnouncementController = require('./announcement.controller');
const {
  announcementValidator,
  updateAnnouncementValidator,
  eventValidator,
  updateEventValidator,
  mongoIdValidator,
} = require('./announcement.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');

router.get('/events', AnnouncementController.getAllEvents);
router.get('/events/:id', validate(mongoIdValidator()), AnnouncementController.getEventById);
router.post('/events', protect, validate(eventValidator), AnnouncementController.createEvent);
router.put('/events/:id', protect, validate(mongoIdValidator()), validate(updateEventValidator), AnnouncementController.updateEvent);
router.delete('/events/:id', protect, validate(mongoIdValidator()), AnnouncementController.deleteEvent);

router.get('/', AnnouncementController.getAllAnnouncements);
router.get('/:id', validate(mongoIdValidator()), AnnouncementController.getAnnouncementById);
router.post('/', protect, validate(announcementValidator), AnnouncementController.createAnnouncement);
router.put('/:id', protect, validate(mongoIdValidator()), validate(updateAnnouncementValidator), AnnouncementController.updateAnnouncement);
router.delete('/:id', protect, validate(mongoIdValidator()), AnnouncementController.deleteAnnouncement);

module.exports = router;