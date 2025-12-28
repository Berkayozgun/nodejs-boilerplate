const Note = require('../models/Note');
const { errorLogger } = require('../utils/logger');

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - user
 *       properties:
 *         id:
 *           type: string
 *           readOnly: true
 *           description: Notun otomatik oluşturulan ID'si
 *         title:
 *           type: string
 *           description: Notun başlığı
 *         content:
 *           type: string
 *           description: Notun içeriği
 *         user:
 *           type: string
 *           description: Notu oluşturan kullanıcının ID'si (ObjectId)
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Notun oluşturulma tarihi
 *       example:
 *         id: 60d0fe4f5b357e0015f8a7a1
 *         title: İlk Not Başlığı
 *         content: Bu benim ilk notumun içeriği.
 *         user: 60d0fe4f5b357e0015f8a7a2
 *         createdAt: 2023-10-27T10:00:00.000Z
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: JWT Bearer token'ı girin
 */

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: Not yönetimi işlemleri
 */

/**
 * @swagger
 * /api/v1/notes/admin/all:
 *   get:
 *     summary: Tüm notları (sahiplik kontrolü olmadan) getir - Sadece Adminler
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Tüm notlar başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu rotaya erişim yetkiniz yok (sadece adminler erişebilir)
 */
// @desc    Get all notes for admin
// @route   GET /api/v1/notes/admin/all
// @access  Private/Admin
exports.getAdminAllNotes = async (req, res, next) => {
  try {
    const notes = await Note.find(); // Tüm notları getir
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

/**
 * @swagger
 * /api/v1/notes:
 *   get:
 *     summary: Giriş yapmış kullanıcının tüm notlarını getir
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcının notları başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erişim
 *   post:
 *     summary: Yeni bir not oluştur
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Not başarıyla oluşturuldu
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 *       401:
 *         description: Yetkisiz erişim
 */
// @desc    Get all notes
// @route   GET /api/v1/notes
// @access  Private
exports.getNotes = async (req, res, next) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

// @desc    Create new note
// @route   POST /api/v1/notes
// @access  Private
exports.createNote = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const note = await Note.create(req.body);
    res.status(201).json({
      success: true,
      data: note
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

/**
 * @swagger
 * /api/v1/notes/{id}:
 *   get:
 *     summary: Belirli bir notu getir
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Not ID'si
 *     responses:
 *       200:
 *         description: Not başarıyla getirildi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu nota erişim yetkiniz yok
 *       404:
 *         description: Not bulunamadı
 *   put:
 *     summary: Belirli bir notu güncelle
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Not ID'si
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Not başarıyla güncellendi
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu notu güncelleme yetkiniz yok
 *       404:
 *         description: Not bulunamadı
 *   delete:
 *     summary: Belirli bir notu sil
 *     tags: [Notes]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Not ID'si
 *     responses:
 *       200:
 *         description: Not başarıyla silindi
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       401:
 *         description: Yetkisiz erişim
 *       403:
 *         description: Bu notu silme yetkiniz yok
 *       404:
 *         description: Not bulunamadı
 */
// @desc    Get single note
// @route   GET /api/v1/notes/:id
// @access  Private
exports.getNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      const error = new Error(`ID'si ${req.params.id} olan bir not bulunamadı`);
      error.statusCode = 404;
      return next(error);
    }

    // Make sure user is note owner
    if (note.user.toString() !== req.user.id) {
      const error = new Error('Bu nota erişim yetkiniz yok');
      error.statusCode = 403;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

// @desc    Update note
// @route   PUT /api/v1/notes/:id
// @access  Private
exports.updateNote = async (req, res, next) => {
  try {
    let note = await Note.findById(req.params.id);

    if (!note) {
      const error = new Error(`ID'si ${req.params.id} olan bir not bulunamadı`);
      error.statusCode = 404;
      return next(error);
    }

    // Make sure user is note owner
    if (note.user.toString() !== req.user.id) {
      const error = new Error('Bu notu güncelleme yetkiniz yok');
      error.statusCode = 403;
      return next(error);
    }

    note = await Note.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: note
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

// @desc    Delete note
// @route   DELETE /api/v1/notes/:id
// @access  Private
exports.deleteNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      const error = new Error(`ID'si ${req.params.id} olan bir not bulunamadı`);
      error.statusCode = 404;
      return next(error);
    }

    // Make sure user is note owner
    if (note.user.toString() !== req.user.id) {
      const error = new Error('Bu notu silme yetkiniz yok');
      error.statusCode = 403;
      return next(error);
    }

    await note.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};
