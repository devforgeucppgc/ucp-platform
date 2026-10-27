const express = require('express');
const router = express.Router();
const AboutController = require('./about.controller');
const {
  heroValidator,
  introductionValidator,
  statsValidator,
  timelineValidator,
  timelineUpdateValidator,
  leaderValidator,
  leaderUpdateValidator,
  valueValidator,
  valueUpdateValidator,
  mongoIdValidator,
} = require('./about.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../../middleware/upload.middleware');

// --- Public Route ---
router.get('/', AboutController.getAbout);

// --- Protected Singleton Routes ---
router.put(
  '/hero',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  validate(heroValidator),
  AboutController.updateHero
);

router.put(
  '/introduction',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  validate(introductionValidator),
  AboutController.updateIntroduction
);

router.put('/statistics', protect, validate(statsValidator), AboutController.updateStatistics);

// --- Timeline CRUD ---
router.get('/timeline', AboutController.getTimeline);
router.post('/timeline', protect, validate(timelineValidator), AboutController.createTimelineItem);
router.put(
  '/timeline/:id',
  protect,
  validate([mongoIdValidator('id'), timelineUpdateValidator]),
  AboutController.updateTimelineItem
);
router.delete('/timeline/:id', protect, validate(mongoIdValidator('id')), AboutController.deleteTimelineItem);

// --- Leaders CRUD ---
router.get('/leaders', AboutController.getLeaders);
router.post(
  '/leaders',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  validate(leaderValidator),
  AboutController.createLeader
);
router.put(
  '/leaders/:id',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  validate([mongoIdValidator('id'), leaderUpdateValidator]),
  AboutController.updateLeader
);
router.delete('/leaders/:id', protect, validate(mongoIdValidator('id')), AboutController.deleteLeader);

// --- Values CRUD ---
router.get('/values', AboutController.getValues);
router.post('/values', protect, validate(valueValidator), AboutController.createValue);
router.put(
  '/values/:id',
  protect,
  validate([mongoIdValidator('id'), valueUpdateValidator]),
  AboutController.updateValue
);
router.delete('/values/:id', protect, validate(mongoIdValidator('id')), AboutController.deleteValue);

module.exports = router;