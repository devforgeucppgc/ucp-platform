// backend/src/modules/magazines/magazine.controller.js
const asyncHandler = require('../../utils/asyncHandler');
const MagazineService = require('./magazine.service');

class MagazineController {
  getAllMagazines = asyncHandler(async (req, res) => {
    const options = {
      page: parseInt(req.query.page, 10) || 1,
      limit: parseInt(req.query.limit, 10) || 100,
      search: req.query.search,
    };
    
    const result = await MagazineService.getAllMagazines(options);
    
    res.status(200).json({
      success: true,
      message: 'Magazines fetched successfully',
      data: result.magazines || [],
      pagination: result.pagination,
    });
  });

  getMagazine = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const magazine = await MagazineService.getMagazineById(id);
    res.status(200).json({
      success: true,
      message: 'Magazine fetched successfully',
      data: magazine,
    });
  });

  createMagazine = asyncHandler(async (req, res) => {
    console.log('📥 CREATE MAGAZINE');

    const { files, body } = req;

    // ⭐ Set file URLs from multer
    let coverImage = '';
    let pdfUrl = '';

    if (files && files.coverImage && files.coverImage[0]) {
      coverImage = `/uploads/${files.coverImage[0].filename}`;
    }
    if (files && files.pdf && files.pdf[0]) {
      pdfUrl = `/uploads/${files.pdf[0].filename}`;
    }

    // ⭐ FORCE to string (prevents [object Object])
    coverImage = String(coverImage || '');
    pdfUrl = String(pdfUrl || '');

    // Handle topics
    let topics = [];
    if (body.topics) {
      if (Array.isArray(body.topics)) {
        topics = body.topics;
      } else if (typeof body.topics === 'string') {
        try {
          topics = JSON.parse(body.topics);
          if (!Array.isArray(topics)) topics = [];
        } catch {
          topics = [];
        }
      }
    }
    if (body['topics[]']) {
      topics = Array.isArray(body['topics[]']) ? body['topics[]'] : [body['topics[]']];
    }

    const data = {
      title: String(body.title || 'Untitled').trim(),
      issue: String(body.issue || 'Vol 1').trim(),
      description: String(body.description || ''),
      publicationDate: body.publicationDate ? new Date(body.publicationDate) : new Date(),
      status: String(body.status || 'published'),
      topics: topics,
      folder: String(body.folder || ''),
      coverImage: coverImage,
      pdfUrl: pdfUrl,
    };

    console.log('💾 Saving:', { coverImage: data.coverImage, pdfUrl: data.pdfUrl });

    const newMagazine = await MagazineService.createMagazine(data);

    res.status(201).json({
      success: true,
      message: 'Magazine created successfully',
      data: newMagazine,
    });
  });

  updateMagazine = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { files, body } = req;

    const data = {};
    if (body.title !== undefined) data.title = String(body.title);
    if (body.issue !== undefined) data.issue = String(body.issue);
    if (body.description !== undefined) data.description = String(body.description);
    if (body.publicationDate !== undefined) data.publicationDate = new Date(body.publicationDate);
    if (body.date !== undefined) data.publicationDate = new Date(body.date);
    if (body.status !== undefined) data.status = String(body.status);
    if (body.folder !== undefined) data.folder = String(body.folder);

    if (body.topics !== undefined || body['topics[]'] !== undefined) {
      let topics = [];
      if (body.topics) {
        if (Array.isArray(body.topics)) topics = body.topics;
        else if (typeof body.topics === 'string') {
          try { topics = JSON.parse(body.topics); } catch { topics = []; }
        }
      }
      if (body['topics[]']) {
        topics = Array.isArray(body['topics[]']) ? body['topics[]'] : [body['topics[]']];
      }
      data.topics = topics;
    }

    // ⭐ Force to string
    if (files && files.coverImage && files.coverImage[0]) {
      data.coverImage = String(`/uploads/${files.coverImage[0].filename}`);
    } else if (
      typeof body.coverImage === 'string' &&
      body.coverImage.trim() !== '' &&
      body.coverImage !== '[object Object]'
    ) {
      data.coverImage = body.coverImage;
    }

    if (files && files.pdf && files.pdf[0]) {
      data.pdfUrl = String(`/uploads/${files.pdf[0].filename}`);
    } else if (body.pdfUrl !== undefined && body.pdfUrl !== '') {
      data.pdfUrl = String(body.pdfUrl);
    }

    const updatedMagazine = await MagazineService.updateMagazine(id, data);

    res.status(200).json({
      success: true,
      message: 'Magazine updated successfully',
      data: updatedMagazine,
    });
  });

  deleteMagazine = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    try {
      const magazine = await MagazineService.getMagazineById(id);
      
      const path = require('path');
      const fs = require('fs');
      const uploadDir = path.join(__dirname, '../../uploads');
      
      if (magazine.coverImage && typeof magazine.coverImage === 'string' && magazine.coverImage.startsWith('/uploads/')) {
        const filename = magazine.coverImage.replace('/uploads/', '');
        const filePath = path.join(uploadDir, filename);
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
      }
      
      if (magazine.pdfUrl && typeof magazine.pdfUrl === 'string' && magazine.pdfUrl.startsWith('/uploads/')) {
        const filename = magazine.pdfUrl.replace('/uploads/', '');
        const filePath = path.join(uploadDir, filename);
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (e) {}
      }
    } catch (e) {}
    
    await MagazineService.deleteMagazine(id);
    
    res.status(200).json({
      success: true,
      message: 'Magazine deleted successfully',
      data: null,
    });
  });
}

module.exports = new MagazineController();