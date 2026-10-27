const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');
const streamifier = require('streamifier');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file buffer (from Multer memory storage) directly to Cloudinary.
 * MongoDB only ever stores the secure_url and public_id returned here.
 *
 * @param {Buffer} buffer - Raw file bytes from Multer.
 * @param {string} folder - Cloudinary folder (e.g. 'projects', 'magazines').
 * @param {object} [options] - Extra Cloudinary upload options.
 * @returns {Promise<{secure_url: string, public_id: string}>}
 */
const uploadFromBuffer = (buffer, folder, options = {}) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: `ucp_website/${folder}`, ...options },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        return resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
        });
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

/**
 * Derive the public_id from a Cloudinary URL. Returns null for non-Cloudinary URLs
 * so we never attempt to delete assets we do not own.
 *
 * @param {string} url - A Cloudinary secure_url or public_id.
 * @returns {string|null}
 */
const extractPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  // Already a public_id (no scheme)
  if (!/^https?:/.test(url)) return url;

  // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/ucp_website/projects/abc.jpg
  const match = url.match(/\/upload\/(?:v\d+\/)?([^?]+)$/);
  if (!match) return null;
  // Remove file extension so Cloudinary can resolve the asset id
  return match[1].replace(/\.[^.]+$/, '');
};

/**
 * Delete a media asset from Cloudinary.
 *
 * @param {string} url - Cloudinary URL or public_id.
 * @returns {Promise<{result: string, public_id: string|null}>}
 */
const deleteFile = async (url) => {
  const publicId = extractPublicId(url);
  if (!publicId) {
    return { result: 'skipped', public_id: null };
  }
  const response = await cloudinary.uploader.destroy(publicId, { invalidate: true });
  return { result: response.result, public_id: publicId };
};

module.exports = {
  cloudinary,
  uploadFromBuffer,
  deleteFile,
  extractPublicId,
};
