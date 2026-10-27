const express = require('express');
const router = express.Router();
const HomeController = require('./home.controller');
const { protect } = require('../../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../../middleware/upload.middleware');

// Public routes
router.get('/', HomeController.getHome);
router.get('/hero', HomeController.getHero);
router.get('/about', HomeController.getAbout);
router.get('/stats', HomeController.getStats);
router.get('/video', HomeController.getVideo);

// Protected routes
router.put(
  '/hero',
  protect,
  upload.single('heroImage'),
  uploadToCloudinary,
  HomeController.updateHero
);

router.put(
  '/about',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  HomeController.updateAbout
);

router.put(
  '/stats',
  protect,
  HomeController.updateStats
);

router.put(
  '/video',
  protect,
  upload.single('videoUrl'),
  uploadToCloudinary,
  HomeController.updateVideo
);

module.exports = router;
