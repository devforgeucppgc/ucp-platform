const AboutHero = require('./about.hero.model');
const AboutIntroduction = require('./about.introduction.model');
const AboutStatistic = require('./about.statistics.model');
const Timeline = require('./about.timeline.model');
const Leader = require('./about.leader.model');
const Value = require('./about.value.model');

class AboutRepository {
  async getAboutData() {
    try {
      const [hero, introduction, statistics, timeline, leaders, values] = await Promise.all([
        AboutHero.findOne().sort({ createdAt: -1 }).lean(),
        AboutIntroduction.findOne().sort({ createdAt: -1 }).lean(),
        AboutStatistic.findOne().sort({ createdAt: -1 }).lean(),
        Timeline.find().sort({ displayOrder: 1 }).lean(),
        Leader.find().sort({ createdAt: 1 }).lean(),
        Value.find().sort({ createdAt: 1 }).lean(),
      ]);
      // Ensure all fields are at least null or empty array
      return {
        hero: hero || null,
        introduction: introduction || null,
        statistics: statistics || null,
        timeline: timeline || [],
        leaders: leaders || [],
        values: values || [],
      };
    } catch (error) {
      console.error('Error in getAboutData:', error);
      throw error;
    }
  }

  // Generic upsert for singleton models
  async updateSingleton(Model, data) {
    try {
      let doc = await Model.findOne();
      if (doc) {
        return await Model.findByIdAndUpdate(doc._id, data, { new: true, runValidators: true });
      }
      return await Model.create(data);
    } catch (error) {
      console.error(`Error updating ${Model.modelName}:`, error);
      throw error;
    }
  }

  async updateHero(data) {
    return this.updateSingleton(AboutHero, data);
  }

  async updateIntroduction(data) {
    return this.updateSingleton(AboutIntroduction, data);
  }

  async updateStatistics(data) {
    return this.updateSingleton(AboutStatistic, data);
  }

  // --- Timeline CRUD ---
  async getTimeline() {
    try {
      const timeline = await Timeline.find().sort({ displayOrder: 1 }).lean();
      return timeline || []; // Always return an array
    } catch (error) {
      console.error('Error in getTimeline:', error);
      throw error;
    }
  }

  async getTimelineItemById(id) {
    try {
      return await Timeline.findById(id).lean();
    } catch (error) {
      console.error(`Error getting timeline item ${id}:`, error);
      throw error;
    }
  }

  async createTimelineItem(data) {
    try {
      return await Timeline.create(data);
    } catch (error) {
      console.error('Error creating timeline item:', error);
      throw error;
    }
  }

  async updateTimelineItem(id, data) {
    try {
      return await Timeline.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    } catch (error) {
      console.error(`Error updating timeline item ${id}:`, error);
      throw error;
    }
  }

  async deleteTimelineItem(id) {
    try {
      return await Timeline.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting timeline item ${id}:`, error);
      throw error;
    }
  }

  // --- Leaders CRUD ---
  async getLeaders() {
    try {
      const leaders = await Leader.find().sort({ createdAt: 1 }).lean();
      return leaders || [];
    } catch (error) {
      console.error('Error in getLeaders:', error);
      throw error;
    }
  }

  async getLeaderById(id) {
    try {
      return await Leader.findById(id).lean();
    } catch (error) {
      console.error(`Error getting leader ${id}:`, error);
      throw error;
    }
  }

  async createLeader(data) {
    try {
      return await Leader.create(data);
    } catch (error) {
      console.error('Error creating leader:', error);
      throw error;
    }
  }

  async updateLeader(id, data) {
    try {
      return await Leader.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    } catch (error) {
      console.error(`Error updating leader ${id}:`, error);
      throw error;
    }
  }

  async deleteLeader(id) {
    try {
      return await Leader.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting leader ${id}:`, error);
      throw error;
    }
  }

  // --- Values CRUD ---
  async getValues() {
    try {
      const values = await Value.find().sort({ createdAt: 1 }).lean();
      return values || [];
    } catch (error) {
      console.error('Error in getValues:', error);
      throw error;
    }
  }

  async getValueById(id) {
    try {
      return await Value.findById(id).lean();
    } catch (error) {
      console.error(`Error getting value ${id}:`, error);
      throw error;
    }
  }

  async createValue(data) {
    try {
      return await Value.create(data);
    } catch (error) {
      console.error('Error creating value:', error);
      throw error;
    }
  }

  async updateValue(id, data) {
    try {
      return await Value.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
    } catch (error) {
      console.error(`Error updating value ${id}:`, error);
      throw error;
    }
  }

  async deleteValue(id) {
    try {
      return await Value.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting value ${id}:`, error);
      throw error;
    }
  }
}

module.exports = new AboutRepository();