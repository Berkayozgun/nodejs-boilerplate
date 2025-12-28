const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote,
  getAdminAllNotes
} = require('../controllers/noteController');

const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

router.route('/').get(protect, getNotes).post(protect, createNote);
router.route('/:id').get(protect, getNote).put(protect, updateNote).delete(protect, deleteNote);

router.route('/admin/all').get(protect, authorize('admin'), getAdminAllNotes);

module.exports = router;
