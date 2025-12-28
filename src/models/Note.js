const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lütfen bir başlık ekleyin'],
    trim: true,
    maxlength: [100, 'Başlık 100 karakterden fazla olamaz']
  },
  content: {
    type: String,
    required: [true, 'Lütfen bir içerik ekleyin']
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Note', NoteSchema);

