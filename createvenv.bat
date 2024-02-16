@echo off
REM Get the directory of the current batch file
setlocal
cd /d %~dp0
REM Create the virtual environment named 'venv' in the same directory
python3 -m venv venv
echo Virtual environment created successfully in the current directory.
endlocal