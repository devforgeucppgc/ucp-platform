const HomeHero = require('./home.hero.model');
const HomeAbout = require('./home.about.model');
const HomeStats = require('./home.stats.model');
const HomeVideo = require('./home.video.model');

class HomeRepository {
  async getHomeData() {
    const [hero, about, stats, video] = await Promise.all([
      HomeHero.findOne().sort({ createdAt: -1 }).lean(),
      HomeAbout.findOne().sort({ createdAt: -1 }).lean(),
      HomeStats.findOne().sort({ createdAt: -1 }).lean(),
      HomeVideo.findOne().sort({ createdAt: -1 }).lean(),
    ]);
    return { hero, about, stats, video };
  }

  async getHero() {
    return (await HomeHero.findOne().sort({ createdAt: -1 }).lean()) || null;
  }

  async getAbout() {
    return (await HomeAbout.findOne().sort({ createdAt: -1 }).lean()) || null;
  }

  async getStats() {
    return (await HomeStats.findOne().sort({ createdAt: -1 }).lean()) || null;
  }

  async getVideo() {
    return (await HomeVideo.findOne().sort({ createdAt: -1 }).lean()) || null;
  }

  async updateHero(data) {
    const hero = await HomeHero.findOne();
    if (hero) {
      return HomeHero.findByIdAndUpdate(hero._id, data, { new: true, runValidators: true });
    }
    return HomeHero.create(data);
  }

  async updateAbout(data) {
    const about = await HomeAbout.findOne();
    if (about) {
      return HomeAbout.findByIdAndUpdate(about._id, data, { new: true, runValidators: true });
    }
    return HomeAbout.create(data);
  }

  async updateStats(data) {
    const stats = await HomeStats.findOne();
    if (stats) {
      return HomeStats.findByIdAndUpdate(stats._id, data, { new: true, runValidators: true });
    }
    return HomeStats.create(data);
  }

  async updateVideo(data) {
    const video = await HomeVideo.findOne();
    if (video) {
      return HomeVideo.findByIdAndUpdate(video._id, data, { new: true, runValidators: true });
    }
    return HomeVideo.create(data);
  }
}

module.exports = new HomeRepository();
