#!/bin/bash

echo "Starting GoFix Application..."
echo

echo "Starting Backend Server..."
cd backend && npm run dev &
BACKEND_PID=$!

sleep 3

echo "Starting Frontend Server..."
cd ../Frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait
