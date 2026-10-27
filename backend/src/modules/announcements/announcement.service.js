const AnnouncementRepository = require('./announcement.repository');
const AppError = require('../../utils/AppError');

class AnnouncementService {
  // --- Announcements ---
  async getAllAnnouncements(options) {
    const { page = 1, limit = 10, search } = options;
    const { announcements, total } = await AnnouncementRepository.findAllAnnouncements({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    return {
      announcements,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getAnnouncementById(id) {
    const announcement = await AnnouncementRepository.findAnnouncementById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    return announcement;
  }

  async createAnnouncement(data) {
    return await AnnouncementRepository.createAnnouncement(data);
  }

  async updateAnnouncement(id, data) {
    const announcement = await AnnouncementRepository.findAnnouncementById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    return await AnnouncementRepository.updateAnnouncement(id, data);
  }

  async deleteAnnouncement(id) {
    const announcement = await AnnouncementRepository.findAnnouncementById(id);
    if (!announcement) {
      throw new AppError('Announcement not found', 404);
    }
    return await AnnouncementRepository.deleteAnnouncement(id);
  }

  // --- Events ---
  async getAllEvents(options) {
    const { page = 1, limit = 10, search } = options;
    const { events, total } = await AnnouncementRepository.findAllEvents({
      page: parseInt(page),
      limit: parseInt(limit),
      search,
    });
    return {
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit)),
      },
    };
  }

  async getEventById(id) {
    const event = await AnnouncementRepository.findEventById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return event;
  }

  async createEvent(data) {
    return await AnnouncementRepository.createEvent(data);
  }

  async updateEvent(id, data) {
    const event = await AnnouncementRepository.findEventById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return await AnnouncementRepository.updateEvent(id, data);
  }

  async deleteEvent(id) {
    const event = await AnnouncementRepository.findEventById(id);
    if (!event) {
      throw new AppError('Event not found', 404);
    }
    return await AnnouncementRepository.deleteEvent(id);
  }
}

module.exports = new AnnouncementService();
