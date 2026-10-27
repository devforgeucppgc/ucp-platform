// backend/src/modules/media/media.routes.js
const express = require('express');
const router = express.Router();
const MediaController = require('./media.controller');
const { uploadValidator } = require('./media.validator');
const validate = require('../../middleware/validation.middleware');
const { upload, uploadToCloudinary } = require('../../middleware/upload.middleware');
const { protect } = require('../../middleware/auth.middleware');

router.post('/image', protect, upload.single('file'), uploadToCloudinary, validate(uploadValidator), MediaController.uploadImage);
router.post('/video', protect, upload.single('file'), uploadToCloudinary, validate(uploadValidator), MediaController.uploadVideo);
router.post('/pdf', protect, upload.single('file'), uploadToCloudinary, validate(uploadValidator), MediaController.uploadPdf);
router.delete('/', protect, MediaController.deleteMedia);

module.exports = router;