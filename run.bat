@echo off
title جدول يومي - Daily Routine App
color 0B

echo ============================================
echo      جدول يومي - Daily Routine App
echo      منظم المهام والروتين اليومي
echo ============================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [خطأ] Node.js غير مثبت! يرجى تثبيت Node.js من:
    echo        https://nodejs.org
    echo.
    pause
    exit /b
)

echo [✓] تم العثور على Node.js
node --version

:: Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [خطأ] npm غير متوفر!
    pause
    exit /b
)

echo [✓] تم العثور على npm
call npm --version
echo.

:: Check if vite is actually installed (not just node_modules folder)
if not exist "node_modules\.bin\vite.cmd" (
    if exist "node_modules" (
        echo [جاري] تم العثور على اعتماديات قديمة. جاري حذفها وإعادة التثبيت...
        rmdir /s /q "node_modules"
        if exist "package-lock.json" del /q "package-lock.json"
        echo.
    )
    echo [جاري] تثبيت الاعتماديات...
    echo.
    call npm install
    if %ERRORLEVEL% neq 0 (
        echo.
        echo [خطأ] فشل تثبيت الاعتماديات!
        pause
        exit /b
    )
    echo.
    echo [✓] تم تثبيت الاعتماديات بنجاح
    echo.
) else (
    echo [✓] الاعتماديات مثبتة ومحدثة
    echo.
)

:: Information
echo ============================================
echo  سيتم تشغيل التطبيق على الرابط:
echo  http://localhost:3005
echo.
echo  الصفحات المتاحة:
echo  - الرئيسية:  http://localhost:3005
echo  - التقويم:   http://localhost:3005/calendar
echo  - لوحة التحكم: http://localhost:3005/admin
echo ============================================
echo.

:: Wait a moment then open browser
timeout /t 2 /nobreak >nul
start http://localhost:3005

:: Start the Vite development server
echo [جاري] تشغيل خادم التطوير (Vite)...
echo.
call npm run dev

:: If we get here, the server was stopped
echo.
echo [تم] تم إيقاف خادم التطوير.
pause
