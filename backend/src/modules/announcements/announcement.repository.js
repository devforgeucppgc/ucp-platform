const Announcement = require('./announcement.model');
const Event = require('./event.model');

class AnnouncementRepository {
  // --- Announcements ---
  async findAllAnnouncements({ page, limit, search }) {
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Announcement.countDocuments(query);
    return { announcements, total };
  }

  async findAnnouncementById(id) {
    return await Announcement.findById(id);
  }

  async createAnnouncement(data) {
    return await Announcement.create(data);
  }

  async updateAnnouncement(id, data) {
    return await Announcement.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteAnnouncement(id) {
    return await Announcement.findByIdAndDelete(id);
  }

  // --- Events ---
  async findAllEvents({ page, limit, search }) {
    const query = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    const events = await Event.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    const total = await Event.countDocuments(query);
    return { events, total };
  }

  async findEventById(id) {
    return await Event.findById(id);
  }

  async createEvent(data) {
    return await Event.create(data);
  }

  async updateEvent(id, data) {
    return await Event.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async deleteEvent(id) {
    return await Event.findByIdAndDelete(id);
  }
}

module.exports = new AnnouncementRepository();
