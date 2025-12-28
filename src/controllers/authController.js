const User = require('../models/User');
const { logger, errorLogger } = require('../utils/logger');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Kullanıcı adı
 *         email:
 *           type: string
 *           format: email
 *           description: Kullanıcı e-posta adresi
 *         password:
 *           type: string
 *           format: password
 *           description: Kullanıcı şifresi
 *         role:
 *           type: string
 *           enum: [user, publisher, admin]
 *           default: user
 *           description: Kullanıcının rolü
 *       example:
 *         name: John Doe
 *         email: john.doe@example.com
 *         password: password123
 *         role: user
 *     AuthResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         token:
 *           type: string
 */

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Kullanıcı kimlik doğrulama işlemleri
 */

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Yeni kullanıcı kaydı
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, publisher, admin]
 *                 default: user
 *     responses:
 *       200:
 *         description: Kayıt başarılı, JWT token döndürür
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 */
// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role
    });

    sendTokenResponse(user, 200, res);
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Kullanıcı girişi
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Giriş başarılı, JWT token döndürür
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Geçersiz giriş veya doğrulama hatası
 *       401:
 *         description: Geçersiz kimlik bilgileri
 */
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      const error = new Error('Lütfen email ve şifre sağlayın');
      error.statusCode = 400;
      return next(error);
    }

    // Validate input types to prevent NoSQL Injection
    if (typeof email !== 'string' || typeof password !== 'string') {
      const error = new Error('Geçersiz giriş tipi: Email ve şifre string olmalıdır.');
      error.statusCode = 400;
      return next(error);
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const error = new Error('Geçersiz kimlik bilgileri');
      error.statusCode = 401;
      return next(error);
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      const error = new Error('Geçersiz kimlik bilgileri');
      error.statusCode = 401;
      return next(error);
    }

    sendTokenResponse(user, 200, res);
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  // Get expiration time from JWT_EXPIRE (e.g., "30d")
  const jwtExpire = process.env.JWT_EXPIRE;
  const days = parseInt(jwtExpire.replace('d', '')); // Extract the number of days

  const options = {
    expires: new Date(
      Date.now() + days * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      success: true,
      token
    });
};

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Giriş yapmış kullanıcının bilgilerini getir
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Kullanıcı bilgileri
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Yetkisiz erişim
 */
// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (err) {
    errorLogger.error(err.message, { stack: err.stack });
    next(err);
  }
};
