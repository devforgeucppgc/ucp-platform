// backend/src/modules/media/media.controller.js
const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const MediaService = require('./media.service');

class MediaController {
  uploadImage = asyncHandler(async (req, res) => {
    if (!req.file) {
      return responseHelper.error(res, 'No file uploaded.', [], 400);
    }
    
    console.log('📥 Uploading image:', req.file.originalname);
    
    const result = {
      url: req.file.fileUrl,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: 'image',
    };
    
    return responseHelper.success(res, 'Image uploaded successfully.', result);
  });

  uploadVideo = asyncHandler(async (req, res) => {
    if (!req.file) {
      return responseHelper.error(res, 'No file uploaded.', [], 400);
    }
    
    console.log('📥 Uploading video:', req.file.originalname);
    
    const result = {
      url: req.file.fileUrl,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: 'video',
    };
    
    return responseHelper.success(res, 'Video uploaded successfully.', result);
  });

  uploadPdf = asyncHandler(async (req, res) => {
    if (!req.file) {
      return responseHelper.error(res, 'No file uploaded.', [], 400);
    }
    
    console.log('📥 Uploading PDF:', req.file.originalname);
    
    const result = {
      url: req.file.fileUrl,
      publicId: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype,
      type: 'pdf',
    };
    
    return responseHelper.success(res, 'PDF uploaded successfully.', result);
  });

  deleteMedia = asyncHandler(async (req, res) => {
    const { publicId } = req.body;
    if (!publicId) {
      return responseHelper.error(res, 'Public ID is required.', [], 400);
    }
    
    // Delete local file
    const path = require('path');
    const fs = require('fs');
    const filePath = path.join(__dirname, '../../../uploads', publicId);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('🗑️ Deleted file:', filePath);
      }
    } catch (err) {
      console.warn('Could not delete file:', err.message);
    }
    
    return responseHelper.success(res, 'Media deleted successfully.');
  });
}

module.exports = new MediaController();