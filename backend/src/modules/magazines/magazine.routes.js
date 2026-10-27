// backend/src/modules/magazines/magazine.routes.js
const express = require('express');
const router = express.Router();
const MagazineController = require('./magazine.controller');
const { protect } = require('../../middleware/auth.middleware');
const { upload } = require('../../middleware/upload.middleware'); // ⭐ Remove uploadToCloudinary

router.get('/', MagazineController.getAllMagazines);
router.get('/:id', MagazineController.getMagazine);

router.post(
  '/',
  protect,
  upload.fields([                              // ⭐ Multer first
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  MagazineController.createMagazine            // ⭐ Then controller (no uploadToCloudinary)
);

router.put(
  '/:id',
  protect,
  upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'pdf', maxCount: 1 },
  ]),
  MagazineController.updateMagazine
);

router.delete('/:id', protect, MagazineController.deleteMagazine);

module.exports = router;