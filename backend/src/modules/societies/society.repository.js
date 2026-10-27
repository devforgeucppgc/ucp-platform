const Society = require('./society.model');

class SocietyRepository {
  async findAll({ page, limit, search, sort }) {
    const query = {};

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    if (sort) {
      const order = sort.startsWith('-') ? -1 : 1;
      const field = sort.replace(/^-/, '');
      sortOptions[field] = order;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    const societies = await Society.find(query)
      .sort(sortOptions)
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Society.countDocuments(query);
    return { societies, total };
  }

  async findById(id) {
    return await Society.findById(id);
  }

  async findBySlug(identifier) {
    // ✅ FIXED: Searches by slug OR by name so the database doesn't crash
    return await Society.findOne({
      $or: [
        { slug: identifier },
        { name: { $regex: new RegExp(`^${identifier}$`, 'i') } }
      ]
    });
  }

  async create(data) {
    return await Society.create(data);
  }

  async update(id, data) {
    return await Society.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Society.findByIdAndDelete(id);
  }
}

module.exports = new SocietyRepository();