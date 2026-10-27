const ProjectRepository = require('./project.repository');
const AppError = require('../../utils/AppError');
const { deleteFile } = require('../../config/cloudinary');

class ProjectService {
  async getAllProjects(options) {
    const { page = 1, limit = 12, search, sort, category, featured } = options;
    const queryOptions = {
      page: parseInt(page),
      limit: parseInt(limit),
      search,
      sort,
      category,
    };
    if (featured === 'true') {
      queryOptions.featured = true;
    } else if (featured === 'false') {
      queryOptions.featured = false;
    }

    const { projects, total } = await ProjectRepository.findAll(queryOptions);

    return {
      projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getProjectById(id) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    return project;
  }

  async createProject(data) {
    return await ProjectRepository.create(data);
  }

  async updateProject(id, data) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    if (data.image && project.image) {
      await deleteFile(project.image);
    }
    return await ProjectRepository.update(id, data);
  }

  async deleteProject(id) {
    const project = await ProjectRepository.findById(id);
    if (!project) {
      throw new AppError('Project not found', 404);
    }
    await deleteFile(project.image);
    return await ProjectRepository.delete(id);
  }
}

module.exports = new ProjectService();
