// backend/src/modules/magazines/magazine.service.js
const MagazineRepository = require('./magazine.repository');
const AppError = require('../../utils/AppError');

class MagazineService {
  async getAllMagazines(options) {
    const { page = 1, limit = 10, search } = options;
    const { magazines, total } = await MagazineRepository.findAll({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    return {
      magazines,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getMagazineById(id) {
    const magazine = await MagazineRepository.findById(id);
    if (!magazine) {
      throw new AppError('Magazine not found', 404);
    }
    return magazine;
  }

  async createMagazine(data) {
    console.log('Service creating:', { 
      title: data.title, 
      hasCover: !!data.coverImage, 
      hasPdf: !!data.pdfUrl 
    });
    
    // ⭐ Handle date conversion
    let pubDate = new Date();
    if (data.publicationDate) {
      try {
        pubDate = new Date(data.publicationDate);
        if (isNaN(pubDate.getTime())) pubDate = new Date();
      } catch {
        pubDate = new Date();
      }
    }
    
    const validData = {
      title: String(data.title || 'Untitled'),
      issue: String(data.issue || 'Vol 1'),
      description: String(data.description || ''),
      publicationDate: pubDate,
      status: String(data.status || 'published'),
      topics: Array.isArray(data.topics) ? data.topics : [],
      folder: String(data.folder || ''),
      coverImage: String(data.coverImage || ''),
      pdfUrl: String(data.pdfUrl || ''),
    };
    
    console.log('Valid data:', validData);
    
    return await MagazineRepository.create(validData);
  }

  async updateMagazine(id, data) {
    const magazine = await MagazineRepository.findById(id);
    if (!magazine) {
      throw new AppError('Magazine not found', 404);
    }
    
    // Convert date if present
    if (data.publicationDate) {
      try {
        data.publicationDate = new Date(data.publicationDate);
        if (isNaN(data.publicationDate.getTime())) {
          delete data.publicationDate;
        }
      } catch {
        delete data.publicationDate;
      }
    }
    
    return await MagazineRepository.update(id, data);
  }

  async deleteMagazine(id) {
    const magazine = await MagazineRepository.findById(id);
    if (!magazine) {
      throw new AppError('Magazine not found', 404);
    }
    return await MagazineRepository.delete(id);
  }
}

module.exports = new MagazineService();