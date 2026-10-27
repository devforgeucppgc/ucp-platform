const CampusInformation = require('./campus.model');

class CampusRepository {
  async get() {
    // Find the most recently updated campus information document
    return await CampusInformation.findOne().sort({ createdAt: -1 });
  }

  async create(data) {
    return await CampusInformation.create(data);
  }

  async update(data) {
    return await CampusInformation.findOneAndUpdate(
      {},
      data,
      { new: true, upsert: true, runValidators: false }
    );
  }

  async delete() {
    return await CampusInformation.deleteMany({});
  }
}

module.exports = new CampusRepository();
