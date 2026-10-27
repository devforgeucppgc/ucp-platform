// backend/app.js
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { randomUUID } = require('crypto');

const errorHandler = require('./middleware/error.middleware');
const notFound = require('./middleware/notFound.middleware');
const responseHelper = require('./utils/responseHelper');

const app = express();
const isProd = process.env.NODE_ENV === 'production';

// Needed behind Nginx / Render / Heroku etc. so rate limiting sees the real IP
if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
}

// --- Request ID ---
app.use((req, res, next) => {
  req.requestId = req.headers['x-request-id'] || randomUUID();
  res.setHeader('X-Request-Id', req.requestId);
  next();
});

// --- CORS (allowlist) ---
const allowedOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // curl, Postman, server-to-server
      if (allowedOrigins.includes(origin)) return cb(null, true);
      if (!isProd && allowedOrigins.length === 0) return cb(null, true); // dev fallback
      return cb(null, false);
    },
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

// --- Global Middleware ---
app.use(helmet({
  crossOriginResourcePolicy: false, // ⭐ Allow cross-origin resource loading
  contentSecurityPolicy: false,
}));

app.use(compression());
app.use(isProd ? morgan('combined') : morgan('dev'));

// ⭐ INCREASED LIMIT FOR FILE UPLOADS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// ⭐ SERVE STATIC UPLOAD FILES
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  },
}));

// --- Rate Limiting ---
app.use(
  '/api/',
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5000,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Separate instances so counters aren't shared between endpoints
const strict = (opts = {}) =>
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isProd ? 50 : 500,
    standardHeaders: true,
    legacyHeaders: false,
    ...opts,
  });

app.use('/api/v1/auth/login', strict({ skipSuccessfulRequests: true }));
app.use('/api/v1/auth/change-password', strict({ max: isProd ? 10 : 100 }));
// Only the public form submission is limited, not the admin's GET/PATCH/DELETE
app.post('/api/v1/contact', strict());

// --- Health ---
app.get('/health', (req, res) =>
  responseHelper.success(res, 'Server is healthy.', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
);

app.get('/api/v1/health', (req, res) =>
  responseHelper.success(res, 'Server is running.', {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  })
);

// --- API Routes ---
app.use('/api/v1/auth', require('./modules/auth/auth.routes'));
app.use('/api/v1/media', require('./modules/media/media.routes'));
app.use('/api/v1/home', require('./modules/home/home.routes'));
app.use('/api/v1/about', require('./modules/about/about.routes'));
app.use('/api/v1/gallery', require('./modules/gallery/gallery.routes'));
app.use('/api/v1/societies', require('./modules/societies/society.routes'));
app.use('/api/v1/campus-information', require('./modules/campus/campus.routes'));
app.use('/api/v1/announcements', require('./modules/announcements/announcement.routes'));
app.use('/api/v1/magazines', require('./modules/magazines/magazine.routes'));
app.use('/api/v1/projects', require('./modules/projects/project.routes'));
app.use('/api/v1/contact', require('./modules/contact/contact.routes'));
app.use('/api/v1/dashboard', require('./modules/dashboard/dashboard.routes'));

// --- 404 + error handler ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;