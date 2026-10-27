const MediaRepository = require('./media.repository');
const responseHelper = require('../../utils/responseHelper');

class MediaService {
  async uploadImage(file, folder = 'misc') {
    const result = await MediaRepository.uploadFile(file.buffer, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async uploadVideo(file, folder = 'videos') {
    const result = await MediaRepository.uploadFile(file.buffer, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async uploadPdf(file, folder = 'documents') {
    const result = await MediaRepository.uploadFile(file.buffer, folder);
    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  }

  async deleteMedia(publicId) {
    return await MediaRepository.deleteFile(publicId);
  }
}

module.exports = new MediaService();
