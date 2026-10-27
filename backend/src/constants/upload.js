/**
 * Upload configuration shared across the media pipeline.
 * Limits follow API_SPEC.md §20 and ENVIRONMENT_SETUP.md §15.
 */
const FILE_LIMITS = {
  image: 5 * 1024 * 1024, // 5 MB
  video: 100 * 1024 * 1024, // 100 MB
  pdf: 25 * 1024 * 1024, // 25 MB
};

const ALLOWED_TYPES = {
  image: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  video: ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'],
  pdf: ['application/pdf'],
};

/**
 * Cloudinary folders (DEPLOYMENT.md §7). MongoDB stores only secure URLs,
 * so these folders group assets logically inside the ucp_website root.
 */
const UPLOAD_FOLDERS = {
  hero: 'hero',
  about: 'about',
  leaders: 'leaders',
  societies: 'societies',
  'society-members': 'society-members',
  projects: 'projects',
  magazines: 'magazines',
  videos: 'videos',
  documents: 'documents',
  misc: 'misc',
};

module.exports = {
  FILE_LIMITS,
  ALLOWED_TYPES,
  UPLOAD_FOLDERS,
};
