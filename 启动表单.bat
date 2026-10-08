@echo off
chcp 65001 >nul
cd /d "%~dp0"
where py >nul 2>nul
if %errorlevel%==0 (py -3 server.py & goto end)
where python >nul 2>nul
if %errorlevel%==0 (python server.py & goto end)
echo 没有找到 Python。请到 https://www.python.org/downloads/ 安装，安装时勾选「Add python.exe to PATH」，然后重新双击本文件。
:end
pause
