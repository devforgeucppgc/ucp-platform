
const express = require('express');
const router = express.Router();

const GalleryController = require('./gallery.controller');
const { protect } = require('../../middleware/auth.middleware');
const {
  upload,
  uploadToCloudinary,
} = require('../../middleware/upload.middleware');

// Public: anyone can view gallery items
router.get('/', GalleryController.getAll);

// Admin only: create a gallery item
router.post(
  '/',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  GalleryController.create
);

// Admin only: update a gallery item
router.put(
  '/:id',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  GalleryController.update
);

// Admin only: delete a gallery item
router.delete(
  '/:id',
  protect,
  GalleryController.delete
);

module.exports = router;