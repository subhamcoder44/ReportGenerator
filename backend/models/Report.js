const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportName: {
    type: String,
    required: true,
    trim: true
  },
  reportId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  qrCode: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Report', reportSchema);