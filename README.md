.# QR Report Generator

A full-stack application that allows users to upload PDF reports, generate QR codes for them, and access reports by scanning QR codes.

## Features

- **User Authentication**: Login and Signup functionality
- **Report Upload**: Upload PDF reports with custom names and IDs
- **QR Code Generation**: Generate QR codes that link to uploaded reports
- **Report Access**: Anyone can scan QR codes to view and download reports
- **Dashboard**: Manage all your reports in one place

## Tech Stack
.
### Backend.......
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Multer for file uploads
- QR Code generation

### Frontend
- React
- TypeScript
- Tailwind CSS.
- React Router
- Axios for API calls..
- React Toastify for notifications...

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/qr-reports
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
UPLOAD_PATH=./uploads
```

4. Start the backend server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend/vite-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up/Login**: Create an account or login with existing credentials
2. **Upload Report**: Go to the "Upload Report" tab and upload a PDF file with a custom name and ID
3. **Generate QR Code**: Go to the "Generate QR Code" tab, enter the report ID, and generate a QR code
4. **Download QR Code**: Download the generated QR code image
5. **Share QR Code**: Anyone can scan the QR code to access the report
6. **Manage Reports**: View all your uploaded reports in the "My Reports" tab

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Reports
- `POST /api/reports/upload` - Upload a new report
- `GET /api/reports/my-reports` - Get user's reports
- `GET /api/reports/view/:reportId` - View report details
- `GET /api/reports/download/:reportId` - Download report PDF
- `DELETE /api/reports/:reportId` - Delete a report

### QR Codes
- `POST /api/qr/generate` - Generate QR code for a report
- `GET /api/qr/:reportId` - Get QR code for a report

## File Structure

```
fullstack/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Report.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── reports.js
│   │   └── qr.js
│   ├── middleware/
│   │   └── auth.js
│   ├── uploads/
│   ├── package.json
│   └── server.js
└── frontend/
    └── vite-project/
        ├── Components/
        │   ├── LogIn.tsx
        │   ├── Sing_In.tsx
        │   ├── Dashboard.tsx
        │   ├── QrGenarator.tsx
        │   ├── ReportUpload.tsx
        │   └── ReportViewer.tsx
        ├── src/
        │   └── App.tsx
        └── package.json
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File type validation (PDF only)
- File size limits (10MB)
- Protected routes
- Input validation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
