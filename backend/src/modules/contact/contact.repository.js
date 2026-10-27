const ContactPage = require('./ContactPage');
const ContactMessage = require('./contact.message.model');
const AcademicProgram = require('./academic.program.model');

class ContactRepository {
  async getContactPage() {
    let page = await ContactPage.findOne();

    if (!page) {
      page = await ContactPage.create({});
    }

    return page;
  }

  async updateContactPage(data) {
    return await ContactPage.findOneAndUpdate(
      {},
      data,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );
  }

  async createMessage(data) {
    return await ContactMessage.create(data);
  }

  async findAllMessages({ page = 1, limit = 100, search, status }) {
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { interest: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) {
      query.status = status;
    }

    const messages = await ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await ContactMessage.countDocuments(query);

    return { messages, total };
  }

  async findMessageById(id) {
    return await ContactMessage.findById(id);
  }

  async patchMessage(id, data) {
    return await ContactMessage.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  async deleteMessage(id) {
    return await ContactMessage.findByIdAndDelete(id);
  }

  async getAcademicPrograms() {
    return await AcademicProgram.find().sort({ name: 1 });
  }

  async addAcademicProgram(data) {
    return await AcademicProgram.create(data);
  }

  async removeAcademicProgram(id) {
    return await AcademicProgram.findByIdAndDelete(id);
  }
}

module.exports = new ContactRepository();