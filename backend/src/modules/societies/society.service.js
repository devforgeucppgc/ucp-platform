const SocietyRepository = require('./society.repository');
const AppError = require('../../utils/AppError');

class SocietyService {
  async getAllSocieties(options) {
    const { societies, total } = await SocietyRepository.findAll(options);
    return {
      societies,
      pagination: {
        total,
        page: options.page,
        limit: options.limit,
        totalPages: Math.ceil(total / options.limit),
      },
    };
  }

  async getSocietyByIdOrSlug(identifier) {
    // Check if identifier is likely an ID or a slug
    const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier);
    let society;

    if (isMongoId) {
      society = await SocietyRepository.findById(identifier);
    } else {
      society = await SocietyRepository.findBySlug(identifier);
    }

    if (!society) {
      throw new AppError('Society not found', 404, 'RESOURCE_NOT_FOUND');
    }
    return society;
  }

  async createSociety(data) {
    return await SocietyRepository.create(data);
  }

  async updateSociety(id, data) {
    const society = await SocietyRepository.findById(id);
    if (!society) {
      throw new AppError('Society not found', 404, 'RESOURCE_NOT_FOUND');
    }
    return await SocietyRepository.update(id, data);
  }

  async deleteSociety(id) {
    const society = await SocietyRepository.findById(id);
    if (!society) {
      throw new AppError('Society not found', 404, 'RESOURCE_NOT_FOUND');
    }
    return await SocietyRepository.delete(id);
  }
}

module.exports = new SocietyService();
