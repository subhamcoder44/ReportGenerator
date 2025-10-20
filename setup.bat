@echo off
echo 🚀 Setting up QR Report Generator...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
call npm install

echo 📦 Installing frontend dependencies...
cd ..\frontend\vite-project
call npm install

echo ✅ Setup complete!
echo.
echo 🔧 Next steps:
echo 1. Make sure MongoDB is running
echo 2. Create a .env file in the backend directory with:
echo    PORT=5000
echo    MONGODB_URI=mongodb://localhost:27017/qr-reports
echo    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
echo    UPLOAD_PATH=./uploads
echo    FRONTEND_URL=http://localhost:5173
echo.
echo 3. Start the backend server:
echo    cd backend ^&^& npm run dev
echo.
echo 4. Start the frontend server:
echo    cd frontend\vite-project ^&^& npm run dev
echo.
echo 🌐 The application will be available at http://localhost:5173
pause
