// backend/src/middleware/upload.middleware.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
console.log('📁 Upload directory:', uploadDir);

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('✅ Created upload directory');
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('📂 Saving to:', uploadDir);
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // ⭐ Always generate a valid filename
    const ext = path.extname(file.originalname) || '.jpg';
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    console.log('📝 Filename:', uniqueName);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { 
    fileSize: 50 * 1024 * 1024,
    fieldSize: 50 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    console.log('📥 File received:', file.fieldname, file.originalname, file.mimetype);
    if (file.mimetype.startsWith('image/') || 
        file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only images and PDFs allowed'));
    }
  },
});

const uploadToCloudinary = (req, res, next) => {
  try {
    console.log('🔄 uploadToCloudinary middleware running');
    console.log('  - req.file:', req.file ? 'YES' : 'NO');
    console.log('  - req.files:', req.files ? 'YES' : 'NO');
    
    if (req.file) {
      req.file.fileUrl = `/uploads/${req.file.filename}`;
      console.log('  ✅ Single file URL:', req.file.fileUrl);
    }
    
    if (req.files) {
      Object.keys(req.files).forEach(key => {
        if (Array.isArray(req.files[key])) {
          req.files[key].forEach(file => {
            file.fileUrl = `/uploads/${file.filename}`;
            console.log(`  ✅ ${key} URL:`, file.fileUrl);
          });
        }
      });
    }
    
    next();
  } catch (error) {
    console.error('❌ Error:', error);
    next(error);
  }
};

const serveUploads = (app) => {
  app.use('/uploads', require('express').static(uploadDir));
};

const getFileUrl = (filename) => {
  if (!filename || filename === 'undefined' || filename === 'null') {
    return '';
  }
  return `/uploads/${filename}`;
};

module.exports = { 
  upload, 
  uploadToCloudinary, 
  serveUploads, 
  uploadDir, 
  getFileUrl 
};