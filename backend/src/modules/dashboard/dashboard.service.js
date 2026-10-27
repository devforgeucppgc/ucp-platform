const Project = require('../projects/project.model');
const Society = require('../societies/society.model');
const Magazine = require('../magazines/magazine.model');
const ContactMessage = require('../contact/contact.message.model');
const Announcement = require('../announcements/announcement.model');

class DashboardService {
  async getStatistics() {
    const [
      totalProjects,
      totalSocieties,
      totalMagazines,
      totalMessages,
      totalAnnouncements,
    ] = await Promise.all([
      Project.countDocuments(),
      Society.countDocuments(),
      Magazine.countDocuments(),
      ContactMessage.countDocuments(),
      Announcement.countDocuments(),
    ]);

    return {
      totalProjects,
      totalSocieties,
      totalMagazines,
      totalMessages,
      totalAnnouncements,
    };
  }

  async getRecentMessages() {
    return await ContactMessage.find({ status: 'unread' })
      .sort({ createdAt: -1 })
      .limit(5);
  }

  async getRecentActivity() {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const recentProjects = await Project.find({ updatedAt: { $gte: oneDayAgo } })
      .sort({ updatedAt: -1 })
      .limit(2)
      .lean();
    const recentSocieties = await Society.find({ updatedAt: { $gte: oneDayAgo } })
      .sort({ updatedAt: -1 })
      .limit(2)
      .lean();
    const recentMagazines = await Magazine.find({ updatedAt: { $gte: oneWeekAgo } })
      .sort({ updatedAt: -1 })
      .limit(1)
      .lean();

    const activity = [
      ...recentProjects.map(p => ({
        type: 'Project',
        item: p,
        timestamp: p.updatedAt,
        action: 'updated',
        title: p.title,
        id: p._id
      })),
      ...recentSocieties.map(s => ({
        type: 'Society',
        item: s,
        timestamp: s.updatedAt,
        action: 'updated',
        title: s.name,
        id: s._id
      })),
      ...recentMagazines.map(m => ({
        type: 'Magazine',
        item: m,
        timestamp: m.updatedAt,
        action: 'published',
        title: m.title,
        id: m._id
      })),
    ];

    // Sort all activities by timestamp
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return activity.slice(0, 5);
  }

  async getUnreadMessagesCount() {
    return await ContactMessage.countDocuments({ status: 'unread' });
  }

  async getWeeklyActivityStats() {
    const today = new Date();
    const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());

    const projectsCreated = await Project.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    const societiesCreated = await Society.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    const magazinesCreated = await Magazine.countDocuments({
      createdAt: { $gte: startOfWeek }
    });

    return {
      projectsCreated,
      societiesCreated,
      magazinesCreated,
      weekStart: startOfWeek.toISOString(),
    };
  }
}

module.exports = new DashboardService();
