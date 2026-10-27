
const Gallery = require('./gallery.model');

class GalleryRepository {
  async findAll({ society, page = 1, limit = 12 } = {}) {
    const query = {};

    if (society) {
      query.society = society;
    }

    const skip = (page - 1) * limit;

    const [images, total] = await Promise.all([
      Gallery.find(query)
        .populate('society', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Gallery.countDocuments(query),
    ]);

    return { images, total };
  }

  async findById(id) {
    return Gallery.findById(id).populate('society', 'name slug');
  }

  async create(data) {
    return Gallery.create(data);
  }

  async update(id, data) {
    return Gallery.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return Gallery.findByIdAndDelete(id);
  }
}

module.exports = new GalleryRepository();