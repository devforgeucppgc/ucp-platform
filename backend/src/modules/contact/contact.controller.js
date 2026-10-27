const asyncHandler = require('../../utils/asyncHandler');
const responseHelper = require('../../utils/responseHelper');
const ContactService = require('./contact.service');

class ContactController {
  submitContactForm = asyncHandler(async (req, res) => {
    const message = await ContactService.createMessage(req.body);
    responseHelper.success(res, 'Your message has been received.', message, 201);
  });

  getContactPage = asyncHandler(async (req, res) => {
    const page = await ContactService.getContactPage();
    responseHelper.success(res, 'Contact page settings fetched.', page);
  });

  updateContactPage = asyncHandler(async (req, res) => {
    const updated = await ContactService.updateContactPage(req.body);
    responseHelper.success(res, 'Contact page settings updated.', updated);
  });

  getAllMessages = asyncHandler(async (req, res) => {
    const result = await ContactService.getAllMessages(req.query);
    responseHelper.success(res, 'Messages fetched.', result);
  });

  getMessage = asyncHandler(async (req, res) => {
    const message = await ContactService.getMessageById(req.params.id);
    responseHelper.success(res, 'Message fetched.', message);
  });

  patchMessage = asyncHandler(async (req, res) => {
    const updated = await ContactService.patchMessage(req.params.id, req.body);
    responseHelper.success(res, 'Message updated.', updated);
  });

  deleteMessage = asyncHandler(async (req, res) => {
    await ContactService.deleteMessage(req.params.id);
    responseHelper.success(res, 'Message deleted.', null, 200);
  });

  getAcademicPrograms = asyncHandler(async (req, res) => {
    const programs = await ContactService.getAcademicPrograms();
    responseHelper.success(res, 'Programs fetched.', programs);
  });

  addAcademicProgram = asyncHandler(async (req, res) => {
    const newProgram = await ContactService.addAcademicProgram(req.body);
    responseHelper.success(res, 'Program added.', newProgram, 201);
  });

  removeAcademicProgram = asyncHandler(async (req, res) => {
    await ContactService.removeAcademicProgram(req.params.id);
    responseHelper.success(res, 'Program removed.', null, 200);
  });
}

module.exports = new ContactController();