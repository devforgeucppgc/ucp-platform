const express = require('express');
const router = express.Router();
const ProjectController = require('./project.controller');
const {
  projectValidator,
  projectUpdateValidator,
  projectIdValidator,
} = require('./project.validator');
const validate = require('../../middleware/validation.middleware');
const { protect } = require('../../middleware/auth.middleware');
const { upload, uploadToCloudinary } = require('../../middleware/upload.middleware');

// Public routes
router.get('/', ProjectController.getAllProjects);
router.get('/:id', validate(projectIdValidator), ProjectController.getProject);

// Protected (admin) routes
router.post(
  '/',
  protect,
  upload.single('image'),
  uploadToCloudinary,
  validate(projectValidator),
  ProjectController.createProject
);

router.put(
  '/:id',
  protect,
  validate(projectIdValidator),
  upload.single('image'),
  uploadToCloudinary,
  validate(projectUpdateValidator),
  ProjectController.updateProject
);

router.delete('/:id', protect, validate(projectIdValidator), ProjectController.deleteProject);

module.exports = router;
