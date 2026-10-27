import axios from 'axios';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Session is in localStorage ("Remember me") or sessionStorage (not remembered).
const readSession = () =>
  localStorage.getItem('uni_admin_session') ||
  sessionStorage.getItem('uni_admin_session');

apiClient.interceptors.request.use(
  (config) => {
    const raw = readSession();

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        const token = parsed?.token || raw;

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        config.headers.Authorization = `Bearer ${raw}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

const getData = (response) => response.data;

const get = (url, config = {}) => apiClient.get(url, config).then(getData);
const post = (url, data = {}, config = {}) => apiClient.post(url, data, config).then(getData);
const put = (url, data = {}, config = {}) => apiClient.put(url, data, config).then(getData);
const patch = (url, data = {}, config = {}) => apiClient.patch(url, data, config).then(getData);
const del = (url, config = {}) => apiClient.delete(url, config).then(getData);

export const authService = {
  login: async (credentials) => post('/auth/login', credentials),

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

  updateHero: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('heroImage', imageFile);
      return put('/home/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put('/home/hero', data);
  },

  updateAbout: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);
      return put('/home/about', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put('/home/about', data);
  },

  updateStats: async (data) => put('/home/stats', data),

  updateVideo: async (data, videoFile) => {
    if (videoFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('videoUrl', videoFile);
      return put('/home/video', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put('/home/video', data);
  },
};

export const aboutService = {
  getAbout: async () => get('/about'),
  getTimeline: async () => get('/about/timeline'),
  getLeaders: async () => get('/about/leaders'),
  getValues: async () => get('/about/values'),

  updateHero: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);
      return put('/about/hero', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put('/about/hero', data);
  },

  updateIntroduction: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);
      return put('/about/introduction', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put('/about/introduction', data);
  },

  updateStatistics: async (data) => put('/about/statistics', data),

  createTimelineItem: async (data) => post('/about/timeline', data),
  updateTimelineItem: async (id, data) => put(`/about/timeline/${id}`, data),
  deleteTimelineItem: async (id) => del(`/about/timeline/${id}`),

  createLeader: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);
      return post('/about/leaders', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return post('/about/leaders', data);
  },

  updateLeader: async (id, data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);
      return put(`/about/leaders/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }
    return put(`/about/leaders/${id}`, data);
  },

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

  // Events endpoints
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

export const magazineService = {
  getAllMagazines: async (params = {}) => get('/magazines', { params }),
  getMagazines: async (params = {}) => get('/magazines', { params }),

  getMagazine: async (id) => get(`/magazines/${id}`),

  createMagazine: async (data, coverFile, pdfFile) => {
    // If we have files, send as FormData
    if (coverFile || pdfFile) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(val => formData.append(`${key}[]`, val));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      if (coverFile) formData.append('coverImage', coverFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      return post('/magazines', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return post('/magazines', data);
  },
  addMagazine: async (data, coverFile, pdfFile) => magazineService.createMagazine(data, coverFile, pdfFile),

  updateMagazine: async (id, data, coverFile, pdfFile) => {
    if (coverFile || pdfFile) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(val => formData.append(`${key}[]`, val));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      if (coverFile) formData.append('coverImage', coverFile);
      if (pdfFile) formData.append('pdf', pdfFile);

      return put(`/magazines/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return put(`/magazines/${id}`, data);
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

  createProject: async (data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(val => formData.append(`${key}[]`, val));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);

      return post('/projects', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return post('/projects', data);
  },
  addProject: async (data, imageFile) => projectService.createProject(data, imageFile),

  updateProject: async (id, data, imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          data[key].forEach(val => formData.append(`${key}[]`, val));
        } else if (data[key] !== undefined && data[key] !== null) {
          formData.append(key, data[key]);
        }
      });
      formData.append('image', imageFile);

      return put(`/projects/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return put(`/projects/${id}`, data);
  },
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
  uploadMedia: async (formData) =>
    post('/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),

  deleteMedia: async (id) => del(`/media/${id}`),
};

export default apiClient;