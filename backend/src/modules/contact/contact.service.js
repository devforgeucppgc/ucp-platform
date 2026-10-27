const ContactRepository = require('./contact.repository');
const AppError = require('../../utils/AppError');

class ContactService {
  async getContactPage() {
    return await ContactRepository.getContactPage();
  }

  async updateContactPage(data) {
    return await ContactRepository.updateContactPage(data);
  }

  async createMessage(data) {
    return await ContactRepository.createMessage(data);
  }

  async getAllMessages(options = {}) {
    const { page = 1, limit = 100, search, status } = options;

    const parsedPage = parseInt(page, 10) || 1;
    const parsedLimit = parseInt(limit, 10) || 100;

    const { messages, total } = await ContactRepository.findAllMessages({
      page: parsedPage,
      limit: parsedLimit,
      search,
      status,
    });

    return {
      messages,
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit),
      },
    };
  }

  async getMessageById(id) {
    const message = await ContactRepository.findMessageById(id);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    if (message.status === 'unread') {
      return await ContactRepository.patchMessage(id, { status: 'read' });
    }

    return message;
  }

  async patchMessage(id, data) {
    const message = await ContactRepository.findMessageById(id);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    const payload = { ...data };

    if (payload.replyMessage && payload.replyMessage.trim()) {
      payload.replyMessage = payload.replyMessage.trim();

      if (!payload.status) {
        payload.status = 'replied';
      }

      if (!payload.repliedAt) {
        payload.repliedAt = new Date();
      }
    }

    if (payload.status === 'replied' && !payload.repliedAt) {
      payload.repliedAt = new Date();
    }

    return await ContactRepository.patchMessage(id, payload);
  }

  async deleteMessage(id) {
    const message = await ContactRepository.findMessageById(id);

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    return await ContactRepository.deleteMessage(id);
  }

  async getAcademicPrograms() {
    return await ContactRepository.getAcademicPrograms();
  }

  async addAcademicProgram(data) {
    if (!data.name || !data.name.trim()) {
      throw new AppError('Program name is required', 400);
    }

    return await ContactRepository.addAcademicProgram({
      name: data.name.trim(),
    });
  }

  async removeAcademicProgram(id) {
    const program = await ContactRepository.removeAcademicProgram(id);

    if (!program) {
      throw new AppError('Program not found', 404);
    }

    return program;
  }
}

module.exports = new ContactService();