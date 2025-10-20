const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Upload report
router.post('/upload', auth, upload.single('report'), async (req, res) => {
  try {
    const { reportName, reportId } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if report ID already exists
    const existingReport = await Report.findOne({ reportId });
    if (existingReport) {
      // Delete the uploaded file
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Report ID already exists' });
    }

    const report = new Report({
      reportName,
      reportId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      uploadedBy: req.userId
    });

    await report.save();

    res.status(201).json({
      message: 'Report uploaded successfully',
      report: {
        id: report._id,
        reportName: report.reportName,
        reportId: report.reportId,
        fileName: report.fileName
      }
    });
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all reports for a user
router.get('/my-reports', auth, async (req, res) => {
  try {
    const reports = await Report.find({ uploadedBy: req.userId })
      .select('-filePath')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get report by ID (for QR code access)
router.get('/view/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findOne({ reportId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if file exists
    if (!fs.existsSync(report.filePath)) {
      return res.status(404).json({ message: 'Report file not found' });
    }

    res.json({
      reportName: report.reportName,
      reportId: report.reportId,
      fileName: report.fileName,
      createdAt: report.createdAt
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Download report
router.get('/download/:reportId', async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findOne({ reportId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check if file exists
    if (!fs.existsSync(report.filePath)) {
      return res.status(404).json({ message: 'Report file not found' });
    }

    res.download(report.filePath, report.fileName);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete report
router.delete('/:reportId', auth, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findOne({ reportId, uploadedBy: req.userId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Delete file from filesystem
    if (fs.existsSync(report.filePath)) {
      fs.unlinkSync(report.filePath);
    }

    await Report.findByIdAndDelete(report._id);
    
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
