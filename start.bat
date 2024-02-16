@echo off
REM Start the client app in a new command window
start cmd /k "cd build && npm start"

REM Start the server app in a new command window
start cmd /k "cd server && python app.py"