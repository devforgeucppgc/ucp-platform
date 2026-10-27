const Magazine = require('./magazine.model');

class MagazineRepository {
  async findAll({ page, limit, search }) {
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const magazines = await Magazine.find(query)
      .sort({ publicationDate: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Magazine.countDocuments(query);
    return { magazines, total };
  }

  async findById(id) {
    return await Magazine.findById(id);
  }

  async create(data) {
    return await Magazine.create(data);
  }

  async update(id, data) {
    return await Magazine.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return await Magazine.findByIdAndDelete(id);
  }
}

module.exports = new MagazineRepository();
