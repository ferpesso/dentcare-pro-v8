#!/bin/bash

# Script de Instalação Automática - DentCare PRO
# Versão: 1.0
# Data: 16 de Outubro de 2025

set -e  # Parar se houver erro

echo "╔════════════════════════════════════════════════════════╗"
echo "║     INSTALAÇÃO AUTOMÁTICA - DENTCARE PRO v1.1.0        ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Função para imprimir mensagens
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Verificar se está a correr como root
if [ "$EUID" -eq 0 ]; then 
    print_error "NÃO execute este script como root (sudo)"
    exit 1
fi

# 1. Verificar Node.js
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  Verificando Node.js..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado"
    print_info "Instale com: curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash - && sudo apt install -y nodejs"
    exit 1
fi

NODE_VERSION=$(node --version)
print_success "Node.js instalado: $NODE_VERSION"

# 2. Verificar pnpm
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  Verificando pnpm..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v pnpm &> /dev/null; then
    print_info "Instalando pnpm..."
    npm install -g pnpm
fi

PNPM_VERSION=$(pnpm --version)
print_success "pnpm instalado: $PNPM_VERSION"

# 3. Verificar MySQL
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  Verificando MySQL..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if ! command -v mysql &> /dev/null; then
    print_error "MySQL não encontrado"
    print_info "Instale com: sudo apt update && sudo apt install mysql-server -y"
    exit 1
fi

if ! sudo systemctl is-active --quiet mysql; then
    print_info "Iniciando MySQL..."
    sudo systemctl start mysql
fi

print_success "MySQL está a correr"

# 4. Configurar Base de Dados
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Configurando Base de Dados..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Criando base de dados e utilizador..."
sudo mysql -e "CREATE DATABASE IF NOT EXISTS dentcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null || true
sudo mysql -e "CREATE USER IF NOT EXISTS 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2024';" 2>/dev/null || true
sudo mysql -e "GRANT ALL PRIVILEGES ON dentcare_db.* TO 'dentcare'@'localhost';" 2>/dev/null || true
sudo mysql -e "FLUSH PRIVILEGES;" 2>/dev/null || true

print_success "Base de dados configurada"

# 5. Restaurar Backup
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  Restaurando Backup da Base de Dados..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -f "dentcare-db-backup-FINAL.sql" ]; then
    print_info "Importando dados..."
    mysql -u dentcare -pdentcare2024 dentcare_db < dentcare-db-backup-FINAL.sql
    
    # Verificar
    TABLE_COUNT=$(mysql -u dentcare -pdentcare2024 dentcare_db -e "SHOW TABLES;" -s | wc -l)
    print_success "Backup restaurado ($TABLE_COUNT tabelas)"
else
    print_error "Ficheiro dentcare-db-backup-FINAL.sql não encontrado"
    exit 1
fi

# 6. Verificar .env
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  Verificando Variáveis de Ambiente..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ ! -f ".env" ]; then
    print_error "Ficheiro .env não encontrado!"
    print_info "Criando .env de exemplo..."
    
    cat > .env << 'EOF'
# Base de Dados
DATABASE_URL="mysql://dentcare:dentcare2024@localhost:3306/dentcare_db"

# APIs de IA (IMPORTANTE - SUBSTITUA PELAS SUAS CHAVES!)
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
XAI_API_KEY="SUA_CHAVE_XAI_AQUI"

# Servidor
PORT=3000
NODE_ENV=production
EOF
    
    print_error "ATENÇÃO: Edite o ficheiro .env e adicione suas chaves de API!"
    print_info "Edite com: nano .env"
    exit 1
fi

# Verificar se as chaves foram configuradas
if grep -q "SUA_CHAVE_GEMINI_AQUI" .env; then
    print_error "ATENÇÃO: Você precisa configurar as chaves de API no ficheiro .env"
    print_info "Edite com: nano .env"
    exit 1
fi

print_success "Ficheiro .env configurado"

# 7. Instalar Dependências
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "7️⃣  Instalando Dependências..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Isto pode demorar 5-10 minutos..."
pnpm install

print_success "Dependências instaladas"

# 8. Build
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "8️⃣  Fazendo Build do Projeto..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

print_info "Isto pode demorar 2-5 minutos..."
pnpm build

print_success "Build concluído"

# 9. Verificações Finais
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "9️⃣  Verificações Finais..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Verificar dist
if [ -f "dist/index.js" ]; then
    print_success "Build gerado: dist/index.js"
else
    print_error "Ficheiro dist/index.js não encontrado"
    exit 1
fi

# Verificar correções
if grep -q "nif?.toLowerCase" client/src/pages/Utentes.tsx; then
    print_success "Correção de procura aplicada"
else
    print_error "Correção de procura NÃO aplicada"
fi

if [ -f "server/gemini-image-helper.ts" ]; then
    print_success "Helper Gemini encontrado"
else
    print_error "Helper Gemini NÃO encontrado"
fi

# 10. Concluído
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║              ✅ INSTALAÇÃO CONCLUÍDA! ✅                ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
print_success "Sistema DentCare PRO instalado com sucesso!"
echo ""
print_info "Para iniciar o servidor, execute:"
echo "  NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &"
echo ""
print_info "Para aceder ao sistema:"
echo "  http://localhost:3000"
echo ""
print_info "Para ver logs:"
echo "  tail -f dentcare.log"
echo ""
print_info "Consulte GUIA_DEPLOY_PASSO_A_PASSO.md para mais informações"
echo ""

