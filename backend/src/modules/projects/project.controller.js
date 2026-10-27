const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const ProjectService = require('./project.service');

class ProjectController {
  getAllProjects = asyncHandler(async (req, res) => {
    const result = await ProjectService.getAllProjects(req.query);
    responseHelper.success(res, 'Projects fetched successfully.', result);
  });

  getProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const project = await ProjectService.getProjectById(id);
    responseHelper.success(res, 'Project fetched successfully.', project);
  });

  createProject = asyncHandler(async (req, res) => {
    const data = {
      ...req.body,
      image: req.fileUrl,
    };
    const newProject = await ProjectService.createProject(data);
    responseHelper.success(res, 'Project created successfully.', newProject, 201);
  });

  updateProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = {
      ...req.body,
    };
    if (req.fileUrl) {
      data.image = req.fileUrl;
    }
    const updatedProject = await ProjectService.updateProject(id, data);
    responseHelper.success(res, 'Project updated successfully.', updatedProject);
  });

  deleteProject = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await ProjectService.deleteProject(id);
    responseHelper.success(res, 'Project deleted successfully.', null, 204);
  });
}

module.exports = new ProjectController();
