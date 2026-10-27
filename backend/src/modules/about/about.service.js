const AboutRepository = require('./about.repository');
const AppError = require('../../utils/AppError');

class AboutService {
  async getAboutContent() {
    return await AboutRepository.getAboutData();
  }

  async updateHero(data) {
    return await AboutRepository.updateHero(data);
  }

  async updateIntroduction(data) {
    return await AboutRepository.updateIntroduction(data);
  }

  async updateStatistics(data) {
    return await AboutRepository.updateStatistics(data);
  }

  // Timeline Service
  async getTimeline() {
    return await AboutRepository.getTimeline();
  }

  async createTimelineItem(data) {
    return await AboutRepository.createTimelineItem(data);
  }

  async updateTimelineItem(id, data) {
    const item = await AboutRepository.getTimelineItemById(id);
    if (!item) {
      throw new AppError('Timeline item not found', 404);
    }
    return await AboutRepository.updateTimelineItem(id, data);
  }

  async deleteTimelineItem(id) {
    const item = await AboutRepository.getTimelineItemById(id);
    if (!item) {
      throw new AppError('Timeline item not found', 404);
    }
    return await AboutRepository.deleteTimelineItem(id);
  }

  // Leader Service
  async getLeaders() {
    return await AboutRepository.getLeaders();
  }

  async createLeader(data) {
    return await AboutRepository.createLeader(data);
  }

  async updateLeader(id, data) {
    const leader = await AboutRepository.getLeaderById(id);
    if (!leader) {
      throw new AppError('Leader not found', 404);
    }
    return await AboutRepository.updateLeader(id, data);
  }

  async deleteLeader(id) {
    const leader = await AboutRepository.getLeaderById(id);
    if (!leader) {
      throw new AppError('Leader not found', 404);
    }
    return await AboutRepository.deleteLeader(id);
  }

  // Value Service
  async getValues() {
    return await AboutRepository.getValues();
  }

  async createValue(data) {
    return await AboutRepository.createValue(data);
  }

  async updateValue(id, data) {
    const value = await AboutRepository.getValueById(id);
    if (!value) {
      throw new AppError('Value not found', 404);
    }
    return await AboutRepository.updateValue(id, data);
  }

  async deleteValue(id) {
    const value = await AboutRepository.getValueById(id);
    if (!value) {
      throw new AppError('Value not found', 404);
    }
    return await AboutRepository.deleteValue(id);
  }
}

module.exports = new AboutService();
