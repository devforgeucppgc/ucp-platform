// src/services/index.js
import axios from 'axios';

// ---------- Helper to convert base64 to File ----------
function dataURLtoFile(dataurl, filename) {
  const arr = dataurl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}

const SESSION_KEY = 'uni_admin_session';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
  maxContentLength: 50 * 1024 * 1024,
  maxBodyLength: 50 * 1024 * 1024,
});

// ---------- Session / token ----------
const readRaw = () =>
  localStorage.getItem(SESSION_KEY) || sessionStorage.getItem(SESSION_KEY);

const getToken = () => {
  const raw = readRaw();
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed.token || null;
    return typeof parsed === 'string' ? parsed : raw;
  } catch {
    return raw;
  }
};

apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    const isAuthForm =
      url.includes('/auth/login') || url.includes('/auth/change-password');

    if (status === 401 && !isAuthForm && getToken()) {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(SESSION_KEY);
      if (
        window.location.pathname.startsWith('/admin') &&
        !window.location.pathname.startsWith('/admin/login')
      ) {
        window.location.replace('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);

// ---------- Helpers ----------
const getData = (response) => response.data;

const get = (url, config = {}) => apiClient.get(url, config).then(getData);
const post = (url, data = {}, config = {}) => apiClient.post(url, data, config).then(getData);
const put = (url, data = {}, config = {}) => apiClient.put(url, data, config).then(getData);
const patch = (url, data = {}, config = {}) => apiClient.patch(url, data, config).then(getData);
const del = (url, config = {}) => apiClient.delete(url, config).then(getData);

const isFileLike = (v) =>
  (typeof File !== 'undefined' && v instanceof File) ||
  (typeof Blob !== 'undefined' && v instanceof Blob);

const buildFormData = (data = {}, files = {}) => {
  const fd = new FormData();

  Object.entries(data || {}).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      const allPrimitive = value.every((v) => v === null || typeof v !== 'object');
      if (allPrimitive) value.forEach((v) => fd.append(`${key}[]`, v));
      else fd.append(key, JSON.stringify(value));
    } else if (isFileLike(value)) {
      fd.append(key, value);
    } else if (value instanceof Date) {
      fd.append(key, value.toISOString());
    } else if (typeof value === 'object') {
      fd.append(key, JSON.stringify(value));
    } else {
      fd.append(key, value);
    }
  });

  Object.entries(files).forEach(([field, file]) => {
    if (file) fd.append(field, file);
  });

  return fd;
};


const withFiles = (method, url, data, files = {}) => {
  const hasFile = Object.values(files).some(Boolean);

  if (hasFile) {
    return method(
      url,
      buildFormData(data, files),
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  }

  return method(url, data);
};


// ---------- Services ----------
export const authService = {
  login: async (credentials) => post('/auth/login', credentials),
  me: async () => get('/auth/me'),
  logout: async () => {
    try {
      return await post('/auth/logout');
    } catch {
      return { success: true };
    }
  },
  changePassword: async ({ currentPassword, newPassword }) =>
    put('/auth/change-password', { currentPassword, newPassword }),
};

export const homeService = {
  getHomePage: async () => get('/home'),
  getHomeData: async () => get('/home'),
  getHomeContent: async () => get('/home'),
  fetchHomePage: async () => get('/home'),

  updateHomePage: async (data) => put('/home', data),
  updateHomeData: async (data) => put('/home', data),
  saveHomePage: async (data) => put('/home', data),
  saveHomeData: async (data) => put('/home', data),

  getHero: async () => get('/home/hero'),
  getAbout: async () => get('/home/about'),
  getStats: async () => get('/home/stats'),
  getVideo: async () => get('/home/video'),

  updateHero: async (data, imageFile) =>
    withFiles(put, '/home/hero', data, { heroImage: imageFile }),
  updateAbout: async (data, imageFile) =>
    withFiles(put, '/home/about', data, { image: imageFile }),
  updateStats: async (data) => put('/home/stats', data),
  updateVideo: async (data, videoFile) =>
    withFiles(put, '/home/video', data, { videoUrl: videoFile }),
};

export const aboutService = {
  getAbout: async () => get('/about'),
  getTimeline: async () => get('/about/timeline'),
  getLeaders: async () => get('/about/leaders'),
  getValues: async () => get('/about/values'),

  updateHero: async (data, imageFile) =>
    withFiles(put, '/about/hero', data, { image: imageFile }),
  updateIntroduction: async (data, imageFile) =>
    withFiles(put, '/about/introduction', data, { image: imageFile }),
  updateStatistics: async (data) => put('/about/statistics', data),

  createTimelineItem: async (data) => post('/about/timeline', data),
  updateTimelineItem: async (id, data) => put(`/about/timeline/${id}`, data),
  deleteTimelineItem: async (id) => del(`/about/timeline/${id}`),

  createLeader: async (data, imageFile) =>
    withFiles(post, '/about/leaders', data, { image: imageFile }),
  updateLeader: async (id, data, imageFile) =>
    withFiles(put, `/about/leaders/${id}`, data, { image: imageFile }),
  deleteLeader: async (id) => del(`/about/leaders/${id}`),

  createValue: async (data) => post('/about/values', data),
  updateValue: async (id, data) => put(`/about/values/${id}`, data),
  deleteValue: async (id) => del(`/about/values/${id}`),
};

export const campusService = {
  getCampusInfo: async () => get('/campus-information'),
  getCampusPage: async () => get('/campus-information'),
  getCampusData: async () => get('/campus-information'),
  getCampusInformation: async () => get('/campus-information'),

  updateCampusInfo: async (data) => put('/campus-information', data),
  updateCampusPage: async (data) => put('/campus-information', data),
  updateCampusData: async (data) => put('/campus-information', data),
  updateCampusInformation: async (data) => put('/campus-information', data),
};
export const campusInfoService = campusService;

export const contactService = {
  submitForm: async (data) => post('/contact', data),
  submitContactForm: async (data) => post('/contact', data),

  getContactPage: async () => get('/contact'),
  updateContactPage: async (data) => put('/contact', data),

  getAllMessages: async (params = {}) => get('/contact/messages', { params }),
  getMessage: async (id) => get(`/contact/messages/${id}`),
  patchMessage: async (id, data) => patch(`/contact/messages/${id}`, data),
  deleteMessage: async (id) => del(`/contact/messages/${id}`),

  getAcademicPrograms: async () => get('/contact/academic-programs'),
  addAcademicProgram: async (data) => post('/contact/academic-programs', data),
  removeAcademicProgram: async (id) => del(`/contact/academic-programs/${id}`),
};

export const societyService = {
  getAllSocieties: async (params = {}) => get('/societies', { params }),
  getSocieties: async (params = {}) => get('/societies', { params }),
  list: async (params = {}) => get('/societies', { params }),

  getSociety: async (id) => get(`/societies/${id}`),

  createSociety: async (data) => post('/societies', data),
  addSociety: async (data) => post('/societies', data),

  updateSociety: async (id, data) => put(`/societies/${id}`, data),
  patchSociety: async (id, data) => patch(`/societies/${id}`, data),

  deleteSociety: async (id) => del(`/societies/${id}`),
  removeSociety: async (id) => del(`/societies/${id}`),
};
export const societiesService = societyService;


export const galleryService = {
  getAllGallery: async (params = {}) =>
    get('/gallery', { params }),

  createGalleryItem: async (data, imageFile) =>
    withFiles(post, '/gallery', data, { image: imageFile }),

  updateGalleryItem: async (id, data, imageFile) =>
    withFiles(put, `/gallery/${id}`, data, { image: imageFile }),

  deleteGalleryItem: async (id) =>
    del(`/gallery/${id}`),
};

export const announcementService = {
  getAllAnnouncements: async (params = {}) => get('/announcements', { params }),
  getAnnouncements: async (params = {}) => get('/announcements', { params }),
  getAllNotices: async (params = {}) => get('/announcements', { params }),
  getNotices: async (params = {}) => get('/announcements', { params }),

  getAnnouncement: async (id) => get(`/announcements/${id}`),
  getNotice: async (id) => get(`/announcements/${id}`),

  createAnnouncement: async (data) => post('/announcements', data),
  addAnnouncement: async (data) => post('/announcements', data),
  createNotice: async (data) => post('/announcements', data),
  addNotice: async (data) => post('/announcements', data),

  updateAnnouncement: async (id, data) => put(`/announcements/${id}`, data),
  updateNotice: async (id, data) => put(`/announcements/${id}`, data),

  patchAnnouncement: async (id, data) => patch(`/announcements/${id}`, data),
  patchNotice: async (id, data) => patch(`/announcements/${id}`, data),

  deleteAnnouncement: async (id) => del(`/announcements/${id}`),
  removeAnnouncement: async (id) => del(`/announcements/${id}`),
  deleteNotice: async (id) => del(`/announcements/${id}`),
  removeNotice: async (id) => del(`/announcements/${id}`),

  getAllEvents: async (params = {}) => get('/announcements/events', { params }),
  getEvent: async (id) => get(`/announcements/events/${id}`),
  createEvent: async (data) => post('/announcements/events', data),
  updateEvent: async (id, data) => put(`/announcements/events/${id}`, data),
  patchEvent: async (id, data) => patch(`/announcements/events/${id}`, data),
  deleteEvent: async (id) => del(`/announcements/events/${id}`),
};
export const announcementsService = announcementService;
export const noticeService = announcementService;
export const noticesService = announcementService;

// ---------- MAGAZINE SERVICE (UPDATED - Accepts FormData) ----------
export const magazineService = {
  getAllMagazines: async (params = {}) => get('/magazines', { params }),
  getMagazines: async (params = {}) => get('/magazines', { params }),
  getMagazine: async (id) => get(`/magazines/${id}`),

  // ⭐ Accepts FormData directly (from Magazines.jsx)
  createMagazine: async (data, coverFile, pdfFile) => {
    console.log('🔍 magazineService.createMagazine called');
    
    // If data is already FormData, send it directly
    if (data instanceof FormData) {
      console.log('  📤 Sending FormData directly');

      return post('/magazines', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }

    // Otherwise, build FormData from regular object
    let actualCoverFile = coverFile;
    let actualPdfFile = pdfFile;
    const cleanData = { ...data };

    console.log('  - data keys:', Object.keys(data));
    console.log('  - hasCoverFile:', !!coverFile);
    console.log('  - hasPdfFile:', !!pdfFile);
    console.log('  - coverImage starts with data:', data.coverImage?.startsWith?.('data:'));
    console.log('  - pdfUrl starts with data:', data.pdfUrl?.startsWith?.('data:'));

    if (!actualCoverFile && data.coverImage && typeof data.coverImage === 'string' && data.coverImage.startsWith('data:')) {
      console.log('  🔄 Converting coverImage base64 to File');
      actualCoverFile = dataURLtoFile(data.coverImage, 'cover.jpg');
      delete cleanData.coverImage;
    }

    if (!actualPdfFile && data.pdfUrl && typeof data.pdfUrl === 'string' && data.pdfUrl.startsWith('data:')) {
      console.log('  🔄 Converting pdfUrl base64 to File');
      actualPdfFile = dataURLtoFile(data.pdfUrl, 'magazine.pdf');
      delete cleanData.pdfUrl;
    }

    if (Array.isArray(cleanData.topics)) {
      cleanData.topics = JSON.stringify(cleanData.topics);
    }

    console.log('  📤 Has cover file:', !!actualCoverFile);
    console.log('  📤 Has pdf file:', !!actualPdfFile);

    return withFiles(post, '/magazines', cleanData, { 
      coverImage: actualCoverFile, 
      pdf: actualPdfFile 
    });
  },
  addMagazine: async (data, coverFile, pdfFile) =>
    magazineService.createMagazine(data, coverFile, pdfFile),

  updateMagazine: async (id, data, coverFile, pdfFile) => {
    // If data is FormData, send directly
    if (data instanceof FormData) {
      return put(`/magazines/${id}`, data);
    }

    let actualCoverFile = coverFile;
    let actualPdfFile = pdfFile;
    const cleanData = { ...data };

    if (!actualCoverFile && data.coverImage && typeof data.coverImage === 'string' && data.coverImage.startsWith('data:')) {
      actualCoverFile = dataURLtoFile(data.coverImage, 'cover.jpg');
      delete cleanData.coverImage;
    }

    if (!actualPdfFile && data.pdfUrl && typeof data.pdfUrl === 'string' && data.pdfUrl.startsWith('data:')) {
      actualPdfFile = dataURLtoFile(data.pdfUrl, 'magazine.pdf');
      delete cleanData.pdfUrl;
    }

    if (Array.isArray(cleanData.topics)) {
      cleanData.topics = JSON.stringify(cleanData.topics);
    }

    return withFiles(put, `/magazines/${id}`, cleanData, { 
      coverImage: actualCoverFile, 
      pdf: actualPdfFile 
    });
  },
  patchMagazine: async (id, data) => patch(`/magazines/${id}`, data),

  deleteMagazine: async (id) => del(`/magazines/${id}`),
  removeMagazine: async (id) => del(`/magazines/${id}`),
};
export const magazinesService = magazineService;

export const projectService = {
  getAllProjects: async (params = {}) => get('/projects', { params }),
  getProjects: async (params = {}) => get('/projects', { params }),
  getProject: async (id) => get(`/projects/${id}`),

  createProject: async (data, imageFile) =>
    withFiles(post, '/projects', data, { image: imageFile }),
  addProject: async (data, imageFile) => projectService.createProject(data, imageFile),

  updateProject: async (id, data, imageFile) =>
    withFiles(put, `/projects/${id}`, data, { image: imageFile }),
  patchProject: async (id, data) => patch(`/projects/${id}`, data),

  deleteProject: async (id) => del(`/projects/${id}`),
  removeProject: async (id) => del(`/projects/${id}`),
};
export const projectsService = projectService;

export const dashboardService = {
  getDashboard: async () => get('/dashboard'),
  getDashboardData: async () => get('/dashboard'),
  getOverview: async () => get('/dashboard'),
  getStats: async () => get('/dashboard'),
};

export const mediaService = {
  uploadMedia: async (formData) => post('/media', formData),
  deleteMedia: async (id) => del(`/media/${id}`),
};

export default apiClient;