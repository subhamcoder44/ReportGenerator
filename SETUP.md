# QR Report Generator - Setup Instructions

## Quick Setup

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory with:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-reports
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_PATH=./uploads
FRONTEND_URL=http://localhost:5173
```

Start the backend:
```bash
npm run dev
```

### 2. Frontend Setup
```bash
cd frontend/vite-project
npm install
```

Start the frontend:
```bash
npm run dev
```

### 3. Database Setup
Make sure MongoDB is running on your system.

## Features
- ✅ User authentication (login/signup)
- ✅ PDF report upload
- ✅ QR code generation
- ✅ Report viewing via QR codes
- ✅ Download functionality
- ✅ Report management

## Usage
1. Sign up or login
2. Upload a PDF report with name and ID
3. Generate QR code for the report
4. Share QR code - anyone can scan to view/download the report

The system is now ready to use!
