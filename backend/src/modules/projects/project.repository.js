const Project = require('./project.model');

class ProjectRepository {
  async findAll({ page, limit, search, sort, category, featured }) {
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (category) {
      query.category = category;
    }
    if (featured !== undefined) {
      query.featured = featured;
    }

    const sortOptions = {};
    if (sort) {
      const order = sort.startsWith('-') ? -1 : 1;
      const field = sort.replace(/^-/, '');
      sortOptions[field] = order;
    } else {
      sortOptions.createdAt = -1;
    }

    const projects = await Project.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Project.countDocuments(query);
    return { projects, total };
  }

  async findById(id) {
    return await Project.findById(id);
  }

  async create(data) {
    return await Project.create(data);
  }

  async update(id, data) {
    return await Project.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Project.findByIdAndDelete(id);
  }
}

module.exports = new ProjectRepository();
