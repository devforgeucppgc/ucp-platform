const HomeRepository = require('./home.repository');

class HomeService {
  async getHomeContent() {
    return HomeRepository.getHomeData();
  }

  async getHero() {
    return HomeRepository.getHero();
  }

  async getAbout() {
    return HomeRepository.getAbout();
  }

  async getStats() {
    return HomeRepository.getStats();
  }

  async getVideo() {
    return HomeRepository.getVideo();
  }

  async updateHero(data) {
    return HomeRepository.updateHero(data);
  }

  async updateAbout(data) {
    return HomeRepository.updateAbout(data);
  }

  async updateStats(data) {
    return HomeRepository.updateStats(data);
  }

  async updateVideo(data) {
    return HomeRepository.updateVideo(data);
  }
}

module.exports = new HomeService();
