
const GalleryRepository = require('./gallery.repository');
const Society = require('../societies/society.model');
const AppError = require('../../utils/AppError');

class GalleryService {
  async getAll(options = {}) {
    const page = Math.max(1, parseInt(options.page, 10) || 1);
    const limit = Math.min(
      50,
      Math.max(1, parseInt(options.limit, 10) || 12)
    );

    const { images, total } = await GalleryRepository.findAll({
      society: options.society,
      page,
      limit,
    });

    return {
      images,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(data) {
    const society = await Society.findById(data.society);

    if (!society) {
      throw new AppError('Society not found', 404);
    }

    return GalleryRepository.create(data);
  }

  async update(id, data) {
    const image = await GalleryRepository.findById(id);

    if (!image) {
      throw new AppError('Gallery image not found', 404);
    }

    if (data.society) {
      const society = await Society.findById(data.society);

      if (!society) {
        throw new AppError('Society not found', 404);
      }
    }

    return GalleryRepository.update(id, data);
  }

  async delete(id) {
    const image = await GalleryRepository.findById(id);

    if (!image) {
      throw new AppError('Gallery image not found', 404);
    }

    return GalleryRepository.delete(id);
  }
}

module.exports = new GalleryService();