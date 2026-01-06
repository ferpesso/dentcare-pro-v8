@echo off
echo ========================================
echo  DentCare PRO v8.0 - Instalacao Windows
echo ========================================
echo.

REM Verificar se o Node.js esta instalado
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Node.js nao esta instalado!
    echo.
    echo Por favor, instale o Node.js primeiro:
    echo https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [OK] Node.js encontrado
node --version
echo.

REM Verificar se o pnpm esta instalado
where pnpm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [AVISO] pnpm nao encontrado. Instalando...
    call npm install -g pnpm
    if %ERRORLEVEL% NEQ 0 (
        echo [ERRO] Falha ao instalar pnpm
        pause
        exit /b 1
    )
)

echo [OK] pnpm encontrado
pnpm --version
echo.

REM Instalar dependencias
echo ========================================
echo  Instalando dependencias...
echo  (Isto pode demorar 5-10 minutos)
echo ========================================
echo.

call pnpm install
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar dependencias
    pause
    exit /b 1
)

echo.
echo [OK] Dependencias instaladas
echo.

REM Build do projeto
echo ========================================
echo  Construindo o projeto...
echo  (Isto pode demorar 1-2 minutos)
echo ========================================
echo.

call pnpm build
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao construir o projeto
    pause
    exit /b 1
)

echo.
echo [OK] Projeto construido
echo.

REM Instalar PM2
echo ========================================
echo  Instalando PM2...
echo ========================================
echo.

call npm install -g pm2
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao instalar PM2
    pause
    exit /b 1
)

echo.
echo [OK] PM2 instalado
echo.

REM Iniciar o sistema
echo ========================================
echo  Iniciando o sistema...
echo ========================================
echo.

call pm2 start ecosystem.config.cjs
if %ERRORLEVEL% NEQ 0 (
    echo [ERRO] Falha ao iniciar o sistema
    pause
    exit /b 1
)

echo.
call pm2 save
echo.

REM Sucesso
echo ========================================
echo  INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo O sistema esta agora online em:
echo http://localhost:3001
echo.
echo Comandos uteis:
echo   pm2 status          - Ver status
echo   pm2 logs            - Ver logs
echo   pm2 restart all     - Reiniciar
echo   pm2 stop all        - Parar
echo.
echo Abra o navegador e aceda:
echo http://localhost:3001
echo.
pause

