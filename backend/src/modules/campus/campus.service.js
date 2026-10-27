// campus.service.js
const CampusRepository = require('./campus.repository');

class CampusService {
  async getCampusInformation() {
    return await CampusRepository.get();
  }

  async createCampusInformation(data) {
    return await CampusRepository.create(data);
  }

  async updateCampusInformation(data) {
    return await CampusRepository.update(data);
  }

  async deleteCampusInformation() {
    return await CampusRepository.delete();
  }
}

module.exports = new CampusService();