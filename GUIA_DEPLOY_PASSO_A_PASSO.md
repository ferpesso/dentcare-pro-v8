# 🚀 GUIA COMPLETO DE DEPLOY - DENTCARE PRO

**Para quem não sabe programar**  
**Siga EXATAMENTE estes passos**

---

## ⚠️ ANTES DE COMEÇAR

**Requisitos do computador:**
- Sistema Operacional: Ubuntu 22.04 ou superior (Linux)
- RAM: Mínimo 4GB (recomendado 8GB)
- Espaço em disco: Mínimo 5GB livre
- Acesso à internet

**O que você vai precisar:**
1. O ficheiro `DENTCARE-PRO-CORRIGIDO-FINAL.tar.gz` (pacote completo)
2. O ficheiro `dentcare-db-backup-FINAL.sql` (base de dados)
3. Acesso ao terminal (linha de comandos)
4. Paciência (o processo leva ~15-20 minutos)

---

## 📦 PASSO 1: EXTRAIR O PACOTE

### 1.1. Fazer Upload dos Ficheiros

Copie os seguintes ficheiros para o computador:
- `DENTCARE-PRO-CORRIGIDO-FINAL.tar.gz`
- `dentcare-db-backup-FINAL.sql`

### 1.2. Abrir o Terminal

No Ubuntu:
- Pressione `Ctrl + Alt + T`
- Ou procure por "Terminal" no menu

### 1.3. Navegar até a Pasta dos Ficheiros

```bash
cd ~/Downloads
# ou onde quer que tenha colocado os ficheiros
```

### 1.4. Extrair o Pacote

```bash
tar -xzf DENTCARE-PRO-CORRIGIDO-FINAL.tar.gz
cd DENTCARE-PRO
```

**Verificar se extraiu corretamente:**
```bash
ls -la
```

Deve ver pastas como: `client`, `server`, `package.json`, etc.

---

## 🗄️ PASSO 2: INSTALAR E CONFIGURAR MYSQL

### 2.1. Atualizar Sistema

```bash
sudo apt update
```

Quando pedir senha, digite a senha do seu utilizador.

### 2.2. Instalar MySQL Server

```bash
sudo apt install mysql-server -y
```

Aguarde a instalação (pode demorar 2-5 minutos).

### 2.3. Iniciar MySQL

```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

### 2.4. Verificar se MySQL Está a Correr

```bash
sudo systemctl status mysql
```

Deve aparecer **"active (running)"** em verde.  
Pressione `q` para sair.

### 2.5. Criar Base de Dados e Utilizador

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS dentcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
sudo mysql -e "CREATE USER IF NOT EXISTS 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2024';"
sudo mysql -e "GRANT ALL PRIVILEGES ON dentcare_db.* TO 'dentcare'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

### 2.6. Restaurar Backup da Base de Dados

```bash
mysql -u dentcare -pdentcare2024 dentcare_db < ~/Downloads/dentcare-db-backup-FINAL.sql
```

**IMPORTANTE:** Não há espaço entre `-p` e `dentcare2024`

### 2.7. Verificar se Importou Corretamente

```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SHOW TABLES;"
```

Deve mostrar 11 tabelas:
- utentes
- odontograma
- endodontia
- imagens
- implantes
- laboratorio
- ortodontia
- periodontograma
- prescricoes
- users
- (e outras)

---

## 📦 PASSO 3: INSTALAR NODE.JS E PNPM

### 3.1. Verificar se Node.js Está Instalado

```bash
node --version
```

Se mostrar uma versão (ex: v22.x.x), **pule para o passo 3.3**.

### 3.2. Instalar Node.js (se necessário)

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### 3.3. Verificar Instalação

```bash
node --version
npm --version
```

Ambos devem mostrar números de versão.

### 3.4. Instalar pnpm

```bash
npm install -g pnpm
```

### 3.5. Verificar pnpm

```bash
pnpm --version
```

Deve mostrar algo como `10.x.x`

---

## ⚙️ PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE

### 4.1. Verificar se o Ficheiro .env Existe

```bash
cd ~/Downloads/DENTCARE-PRO
ls -la .env
```

Se o ficheiro existe, **pule para o passo 4.3**.

### 4.2. Criar Ficheiro .env (se não existir)

```bash
cat > .env << 'EOF'
# Base de Dados
DATABASE_URL="mysql://dentcare:dentcare2024@localhost:3306/dentcare_db"

# APIs de IA (IMPORTANTE!)
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
XAI_API_KEY="SUA_CHAVE_XAI_AQUI"

# Servidor
PORT=3000
NODE_ENV=production
EOF
```

### 4.3. Editar o Ficheiro .env

**MUITO IMPORTANTE:** Você precisa adicionar suas chaves de API.

```bash
nano .env
```

Substitua:
- `SUA_CHAVE_GEMINI_AQUI` pela sua chave do Google Gemini
- `SUA_CHAVE_XAI_AQUI` pela sua chave do Grok (xAI)

**Como obter as chaves:**
- **Gemini:** https://aistudio.google.com/apikey
- **Grok/xAI:** https://console.x.ai/

Depois de editar:
- Pressione `Ctrl + O` para salvar
- Pressione `Enter` para confirmar
- Pressione `Ctrl + X` para sair

### 4.4. Verificar se Ficou Correto

```bash
cat .env
```

Verifique se as chaves foram substituídas corretamente.

---

## 🔨 PASSO 5: INSTALAR DEPENDÊNCIAS E FAZER BUILD

### 5.1. Navegar até a Pasta do Projeto

```bash
cd ~/Downloads/DENTCARE-PRO
```

### 5.2. Instalar Dependências

```bash
pnpm install
```

**Aguarde:** Isto pode demorar 5-10 minutos.

Se aparecer perguntas sobre builds, digite `a` (all) e pressione Enter.

### 5.3. Fazer Build do Projeto

```bash
pnpm build
```

**Aguarde:** Isto pode demorar 2-5 minutos.

### 5.4. Verificar se o Build Foi Bem-Sucedido

```bash
ls -lh dist/
```

Deve ver:
- `index.js` (~50-60 KB)
- Pasta `public/`

---

## 🚀 PASSO 6: INICIAR O SERVIDOR

### 6.1. Iniciar em Modo Produção

```bash
NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

### 6.2. Verificar se Está a Correr

```bash
sleep 3
ps aux | grep "node dist/index.js" | grep -v grep
```

Deve mostrar uma linha com o processo Node.js.

### 6.3. Verificar Logs

```bash
tail -20 dentcare.log
```

Deve ver:
```
Server running on http://localhost:3000/
```

### 6.4. Testar Acesso

```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3000
```

Deve retornar: `HTTP Status: 200`

---

## 🌐 PASSO 7: ACEDER AO SISTEMA

### 7.1. Abrir Navegador

Abra o seu navegador (Chrome, Firefox, etc.)

### 7.2. Aceder ao Sistema

Digite na barra de endereços:
```
http://localhost:3000
```

Ou, se estiver a aceder de outro computador na mesma rede:
```
http://IP_DO_SERVIDOR:3000
```

Para descobrir o IP:
```bash
hostname -I | awk '{print $1}'
```

### 7.3. Verificar se Está a Funcionar

Deve ver o dashboard do DentCare PRO.

---

## ✅ PASSO 8: TESTAR FUNCIONALIDADES

### 8.1. Testar Listagem de Utentes

1. Clique em "Utentes" no menu
2. Deve ver 8 pacientes listados

### 8.2. Testar Procura

1. Digite "Pelé" na caixa de pesquisa
2. Deve filtrar e mostrar apenas pacientes com "Pelé" no nome
3. **NÃO DEVE DAR ERRO**

### 8.3. Testar Análise de IA

1. Clique em "Ver" num paciente
2. Vá ao separador "Imagens"
3. Faça upload de uma imagem de raio-X
4. Clique na imagem para abrir
5. Clique em "Analisar Imagem com IA"
6. Aguarde ~5-10 segundos
7. Deve aparecer a análise completa
8. **NÃO DEVE DAR ERRO 500**

---

## 🔧 PASSO 9: COMANDOS ÚTEIS

### Parar o Servidor

```bash
pkill -f "node dist/index.js"
```

### Reiniciar o Servidor

```bash
pkill -f "node dist/index.js"
sleep 2
cd ~/Downloads/DENTCARE-PRO
NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

### Ver Logs em Tempo Real

```bash
tail -f ~/Downloads/DENTCARE-PRO/dentcare.log
```

Pressione `Ctrl + C` para parar.

### Verificar Status do MySQL

```bash
sudo systemctl status mysql
```

### Reiniciar MySQL

```bash
sudo systemctl restart mysql
```

---

## ❌ RESOLUÇÃO DE PROBLEMAS

### Problema: "Cannot find module '@google/generative-ai'"

**Solução:**
```bash
cd ~/Downloads/DENTCARE-PRO
pnpm add @google/generative-ai
pnpm build
```

### Problema: "GEMINI_API_KEY não está configurada"

**Solução:**
1. Edite o ficheiro `.env`
2. Adicione sua chave do Gemini
3. Reinicie o servidor

### Problema: Erro ao pesquisar pacientes

**Solução:**
1. Verifique se o ficheiro `client/src/pages/Utentes.tsx` foi atualizado
2. Deve ter `?.` antes de `.toLowerCase()` nos campos opcionais
3. Se não tiver, consulte `ALTERACOES_REALIZADAS.md`

### Problema: Porta 3000 já está em uso

**Solução:**
```bash
# Descobrir o que está usando a porta
sudo lsof -i :3000

# Matar o processo
sudo kill -9 PID_DO_PROCESSO

# Ou usar outra porta
NODE_ENV=production PORT=3001 node dist/index.js > dentcare.log 2>&1 &
```

### Problema: MySQL não inicia

**Solução:**
```bash
sudo systemctl status mysql
sudo journalctl -u mysql -n 50
sudo systemctl restart mysql
```

### Problema: Build falha

**Solução:**
```bash
cd ~/Downloads/DENTCARE-PRO
rm -rf node_modules dist
pnpm install
pnpm build
```

---

## 📞 SUPORTE

Se encontrar algum problema não listado aqui:

1. Consulte `TROUBLESHOOTING.md`
2. Consulte `ALTERACOES_REALIZADAS.md`
3. Verifique os logs: `tail -100 dentcare.log`
4. Verifique se todas as alterações foram aplicadas

---

## 📋 CHECKLIST FINAL

Antes de considerar o deploy completo, verifique:

- [ ] MySQL está a correr
- [ ] Base de dados foi restaurada (11 tabelas)
- [ ] Node.js e pnpm estão instalados
- [ ] Ficheiro `.env` tem as chaves de API corretas
- [ ] Dependências foram instaladas (`node_modules` existe)
- [ ] Build foi feito (`dist/` existe)
- [ ] Servidor está a correr (processo Node.js ativo)
- [ ] Sistema acessível via navegador
- [ ] Procura de pacientes funciona SEM ERRO
- [ ] Análise de IA funciona SEM ERRO 500

---

## 🎉 DEPLOY CONCLUÍDO

Se todos os itens do checklist estão marcados, **PARABÉNS!**  
O sistema DentCare PRO está completamente instalado e funcional.

**Próximos passos:**
- Começar a usar o sistema
- Adicionar pacientes reais
- Desenvolver novos módulos conforme necessário

---

**Última atualização:** 16 de Outubro de 2025  
**Versão:** 1.0  
**Testado em:** Ubuntu 22.04 LTS

