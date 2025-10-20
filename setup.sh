#!/bin/bash

echo "🚀 Setting up QR Report Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   On Windows: net start MongoDB"
    echo "   On macOS: brew services start mongodb-community"
    echo "   On Linux: sudo systemctl start mongod"
fi

echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "📦 Installing frontend dependencies..."
cd ../frontend/vite-project
npm install

echo "✅ Setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Make sure MongoDB is running"
echo "2. Create a .env file in the backend directory with:"
echo "   PORT=5000"
echo "   MONGODB_URI=mongodb://localhost:27017/qr-reports"
echo "   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production"
echo "   UPLOAD_PATH=./uploads"
echo "   FRONTEND_URL=http://localhost:5173"
echo ""
echo "3. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "4. Start the frontend server:"
echo "   cd frontend/vite-project && npm run dev"
echo ""
echo "🌐 The application will be available at http://localhost:5173"
