const express = require('express');
const QRCode = require('qrcode');
const Report = require('../models/Report');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate QR code for a report
router.post('/generate', auth, async (req, res) => {
  try {
    const { reportId } = req.body;
    
    const report = await Report.findOne({ reportId, uploadedBy: req.userId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Create URL for the report (pointing to frontend)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const reportUrl = `${frontendUrl}/report/${reportId}`;
    
    // Generate QR code
    const qrCodeDataURL = await QRCode.toDataURL(reportUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    // Update report with QR code
    report.qrCode = qrCodeDataURL;
    await report.save();

    res.json({
      qrCode: qrCodeDataURL,
      reportUrl: reportUrl,
      reportName: report.reportName,
      reportId: report.reportId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get QR code for a report
router.get('/:reportId', auth, async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await Report.findOne({ reportId, uploadedBy: req.userId });
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (!report.qrCode) {
      return res.status(404).json({ message: 'QR code not generated for this report' });
    }

    res.json({
      qrCode: report.qrCode,
      reportName: report.reportName,
      reportId: report.reportId
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
