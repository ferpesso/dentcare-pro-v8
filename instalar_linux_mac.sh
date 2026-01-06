#!/bin/bash

echo "========================================"
echo " DentCare PRO v8.0 - Instalação Linux/Mac"
echo "========================================"
echo ""

# Verificar se o Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não está instalado!"
    echo ""
    echo "Por favor, instale o Node.js primeiro:"
    echo "https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[OK] Node.js encontrado"
node --version
echo ""

# Verificar se o pnpm está instalado
if ! command -v pnpm &> /dev/null; then
    echo "[AVISO] pnpm não encontrado. Instalando..."
    npm install -g pnpm
    if [ $? -ne 0 ]; then
        echo "[ERRO] Falha ao instalar pnpm"
        exit 1
    fi
fi

echo "[OK] pnpm encontrado"
pnpm --version
echo ""

# Instalar dependências
echo "========================================"
echo " Instalando dependências..."
echo " (Isto pode demorar 5-10 minutos)"
echo "========================================"
echo ""

pnpm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências"
    exit 1
fi

echo ""
echo "[OK] Dependências instaladas"
echo ""

# Build do projeto
echo "========================================"
echo " Construindo o projeto..."
echo " (Isto pode demorar 1-2 minutos)"
echo "========================================"
echo ""

pnpm build
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao construir o projeto"
    exit 1
fi

echo ""
echo "[OK] Projeto construído"
echo ""

# Instalar PM2
echo "========================================"
echo " Instalando PM2..."
echo "========================================"
echo ""

npm install -g pm2
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar PM2"
    exit 1
fi

echo ""
echo "[OK] PM2 instalado"
echo ""

# Iniciar o sistema
echo "========================================"
echo " Iniciando o sistema..."
echo "========================================"
echo ""

pm2 start ecosystem.config.cjs
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao iniciar o sistema"
    exit 1
fi

echo ""
pm2 save
echo ""

# Configurar startup (opcional)
echo "Deseja configurar o sistema para iniciar automaticamente ao ligar o computador? (s/n)"
read -r resposta
if [ "$resposta" = "s" ] || [ "$resposta" = "S" ]; then
    pm2 startup
    echo ""
    echo "Execute o comando acima (se aparecer) e depois execute novamente 'pm2 save'"
fi

# Sucesso
echo ""
echo "========================================"
echo " INSTALAÇÃO CONCLUÍDA COM SUCESSO!"
echo "========================================"
echo ""
echo "O sistema está agora online em:"
echo "http://localhost:3001"
echo ""
echo "Comandos úteis:"
echo "  pm2 status          - Ver status"
echo "  pm2 logs            - Ver logs"
echo "  pm2 restart all     - Reiniciar"
echo "  pm2 stop all        - Parar"
echo ""
echo "Abra o navegador e aceda:"
echo "http://localhost:3001"
echo ""

