#!/bin/bash

echo "🚀 Starting CGI Reader Application..."

# Kill any existing processes
echo "🔄 Cleaning up existing processes..."
pkill -f "nest start" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

# Wait a moment
sleep 2

# Start backend
echo "🔧 Starting backend server..."
cd /workspace
PORT=3002 npm run start:dev &
BACKEND_PID=$!

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 10

# Test backend
echo "🧪 Testing backend API..."
if curl -s http://localhost:3002/ > /dev/null; then
    echo "✅ Backend is running on http://localhost:3002"
    echo "📚 API Documentation: http://localhost:3002/api"
else
    echo "❌ Backend failed to start"
    exit 1
fi

# Start frontend
echo "🎨 Starting frontend server..."
cd /workspace/frontend
npm run dev &
FRONTEND_PID=$!

# Wait for frontend to start
echo "⏳ Waiting for frontend to start..."
sleep 15

# Test frontend
echo "🧪 Testing frontend..."
if curl -s http://localhost:3000/ > /dev/null; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend failed to start"
    exit 1
fi

echo ""
echo "🎉 CGI Reader Application is now running!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:3002"
echo "📚 API Documentation: http://localhost:3002/api"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait