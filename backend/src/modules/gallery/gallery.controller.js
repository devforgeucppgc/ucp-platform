
const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const GalleryService = require('./gallery.service');

class GalleryController {
  // Get all gallery images (public)
  getAll = asyncHandler(async (req, res) => {
    const result = await GalleryService.getAll(req.query);

    responseHelper.success(
      res,
      'Gallery fetched successfully.',
      result
    );
  });

  // Create a gallery image
  create = asyncHandler(async (req, res) => {
    const data = {
      ...req.body,
      imageUrl: req.file?.fileUrl || req.body.imageUrl,
      publicId: req.file?.filename || req.body.publicId,
    };

    const image = await GalleryService.create(data);

    responseHelper.success(
      res,
      'Gallery image created successfully.',
      image,
      201
    );
  });

  // Update a gallery image
  update = asyncHandler(async (req, res) => {
    const data = {
      ...req.body,
      ...(req.file && {
        imageUrl: req.file.fileUrl,
        publicId: req.file.filename,
      }),
    };

    const image = await GalleryService.update(
      req.params.id,
      data
    );

    responseHelper.success(
      res,
      'Gallery image updated successfully.',
      image
    );
  });

  // Delete a gallery image
  delete = asyncHandler(async (req, res) => {
    await GalleryService.delete(req.params.id);

    responseHelper.success(
      res,
      'Gallery image deleted successfully.'
    );
  });
}

module.exports = new GalleryController();