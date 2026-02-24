#!/bin/bash

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  🚀 Paper Shop - Full Stack             ║"
echo "║  Cleaning ports 3000 and 3001...         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Kill processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Kill processes on port 3001
lsof -ti:3001 | xargs kill -9 2>/dev/null

# Wait a moment
sleep 2

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║  Starting servers...                      ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# Start backend in background
cd "$(dirname "$0")/server"
npm run dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 3

# Start frontend in background
cd "$(dirname "$0")"
bun run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔌 Backend API: http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID

# Kill both if script is interrupted
trap "kill $BACKEND_PID $FRONTEND_PID" EXIT
