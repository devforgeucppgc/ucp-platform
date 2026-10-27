const cloudinary = require('../../config/cloudinary');

class MediaRepository {
  async uploadFile(fileBuffer, folder) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: folder },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
      uploadStream.end(fileBuffer);
    });
  }

  async deleteFile(publicId) {
    return await cloudinary.uploader.destroy(publicId);
  }
}

module.exports = new MediaRepository();
