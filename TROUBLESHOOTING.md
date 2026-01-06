# 🔧 TROUBLESHOOTING - DENTCARE PRO

**Guia de Resolução de Problemas**  
**Para quem não sabe programar**

---

## 📋 ÍNDICE DE PROBLEMAS

1. [Erros de Instalação](#1-erros-de-instalação)
2. [Erros de Base de Dados](#2-erros-de-base-de-dados)
3. [Erros de Build](#3-erros-de-build)
4. [Erros de Servidor](#4-erros-de-servidor)
5. [Erros de Funcionalidade](#5-erros-de-funcionalidade)
6. [Erros de API/IA](#6-erros-de-apiia)
7. [Problemas de Performance](#7-problemas-de-performance)

---

## 1. ERROS DE INSTALAÇÃO

### Erro: "command not found: pnpm"

**Sintomas:**
```
bash: pnpm: command not found
```

**Causa:** pnpm não está instalado

**Solução:**
```bash
npm install -g pnpm
```

**Verificar:**
```bash
pnpm --version
```

---

### Erro: "command not found: node"

**Sintomas:**
```
bash: node: command not found
```

**Causa:** Node.js não está instalado

**Solução:**
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

**Verificar:**
```bash
node --version
npm --version
```

---

### Erro: "Permission denied"

**Sintomas:**
```
EACCES: permission denied
```

**Causa:** Sem permissões para escrever em pastas

**Solução 1 (Recomendada):**
```bash
# Mudar dono da pasta
sudo chown -R $USER:$USER ~/Downloads/DENTCARE-PRO
```

**Solução 2:**
```bash
# Usar sudo (NÃO recomendado)
sudo pnpm install
```

---

## 2. ERROS DE BASE DE DADOS

### Erro: "Access denied for user 'dentcare'@'localhost'"

**Sintomas:**
```
ERROR 1045 (28000): Access denied for user 'dentcare'@'localhost'
```

**Causa:** Utilizador não foi criado ou senha está errada

**Solução:**
```bash
# Recriar utilizador
sudo mysql -e "DROP USER IF EXISTS 'dentcare'@'localhost';"
sudo mysql -e "CREATE USER 'dentcare'@'localhost' IDENTIFIED BY 'dentcare2024';"
sudo mysql -e "GRANT ALL PRIVILEGES ON dentcare_db.* TO 'dentcare'@'localhost';"
sudo mysql -e "FLUSH PRIVILEGES;"
```

**Verificar:**
```bash
mysql -u dentcare -pdentcare2024 -e "SELECT 'OK' AS status;"
```

---

### Erro: "Unknown database 'dentcare_db'"

**Sintomas:**
```
ERROR 1049 (42000): Unknown database 'dentcare_db'
```

**Causa:** Base de dados não foi criada

**Solução:**
```bash
sudo mysql -e "CREATE DATABASE dentcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

**Verificar:**
```bash
mysql -u dentcare -pdentcare2024 -e "SHOW DATABASES;"
```

---

### Erro: "Can't connect to local MySQL server"

**Sintomas:**
```
ERROR 2002 (HY000): Can't connect to local MySQL server
```

**Causa:** MySQL não está a correr

**Solução:**
```bash
sudo systemctl start mysql
sudo systemctl enable mysql
```

**Verificar:**
```bash
sudo systemctl status mysql
```

Deve mostrar "active (running)" em verde.

---

### Erro: Tabelas não foram importadas

**Sintomas:**
```
Empty set (0.00 sec)
```
ao executar `SHOW TABLES;`

**Causa:** Backup não foi restaurado corretamente

**Solução:**
```bash
# Verificar se o ficheiro de backup existe
ls -lh ~/Downloads/dentcare-db-backup-FINAL.sql

# Restaurar novamente
mysql -u dentcare -pdentcare2024 dentcare_db < ~/Downloads/dentcare-db-backup-FINAL.sql
```

**Verificar:**
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SHOW TABLES;"
```

Deve mostrar 11 tabelas.

---

## 3. ERROS DE BUILD

### Erro: "Cannot find module '@google/generative-ai'"

**Sintomas:**
```
Error: Cannot find module '@google/generative-ai'
```

**Causa:** Dependência não foi instalada

**Solução:**
```bash
cd ~/Downloads/DENTCARE-PRO
pnpm add @google/generative-ai
```

**Verificar:**
```bash
grep "@google/generative-ai" package.json
```

Deve mostrar a dependência.

---

### Erro: "Build failed" ou "TypeScript errors"

**Sintomas:**
```
error TS2304: Cannot find name...
Build failed with errors
```

**Causa:** Cache corrompida ou dependências desatualizadas

**Solução:**
```bash
cd ~/Downloads/DENTCARE-PRO
rm -rf node_modules dist
pnpm install
pnpm build
```

---

### Erro: "ENOSPC: System limit for number of file watchers reached"

**Sintomas:**
```
ENOSPC: System limit for number of file watchers reached
```

**Causa:** Limite de watchers do sistema atingido

**Solução:**
```bash
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

---

## 4. ERROS DE SERVIDOR

### Erro: "Port 3000 is already in use"

**Sintomas:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Causa:** Outra aplicação está usando a porta 3000

**Solução 1 (Matar processo):**
```bash
# Descobrir o PID
sudo lsof -i :3000

# Matar o processo
sudo kill -9 PID_AQUI
```

**Solução 2 (Usar outra porta):**
```bash
NODE_ENV=production PORT=3001 node dist/index.js > dentcare.log 2>&1 &
```

---

### Erro: Servidor não inicia

**Sintomas:**
Nenhuma mensagem aparece após executar o comando de iniciar

**Solução:**
```bash
# Ver logs de erro
cat dentcare.log

# Tentar iniciar em foreground para ver erros
NODE_ENV=production PORT=3000 node dist/index.js
```

Pressione `Ctrl + C` para parar.

---

### Erro: "Cannot read properties of undefined"

**Sintomas:**
```
TypeError: Cannot read properties of undefined (reading 'xxx')
```

**Causa:** Variáveis de ambiente não configuradas

**Solução:**
```bash
# Verificar .env
cat .env

# Editar se necessário
nano .env
```

Certifique-se de que tem:
- `DATABASE_URL`
- `GEMINI_API_KEY`
- `PORT`

---

## 5. ERROS DE FUNCIONALIDADE

### Erro: Procura de pacientes dá erro

**Sintomas:**
```
TypeError: Cannot read properties of null (reading 'toLowerCase')
```

**Causa:** Código não foi corrigido corretamente

**Solução:**
```bash
# Verificar se a correção está aplicada
grep -n "nif?.toLowerCase" client/src/pages/Utentes.tsx
```

Se não retornar nada, o ficheiro não foi atualizado.

**Aplicar correção manualmente:**
```bash
nano client/src/pages/Utentes.tsx
```

Procure por `filteredUtentes` e certifique-se de que tem `?.` antes de `.toLowerCase()`:
```typescript
u.nif?.toLowerCase().includes(searchLower) ||
u.email?.toLowerCase().includes(searchLower) ||
u.telefone?.toLowerCase().includes(searchLower)
```

Depois:
```bash
pnpm build
# Reiniciar servidor
```

---

### Erro: Imagens não aparecem após upload

**Sintomas:**
Imagem desaparece após recarregar a página

**Causa:** Imagens são armazenadas em memória (temporário)

**Solução (Temporária):**
Não reinicie o servidor enquanto estiver trabalhando com imagens.

**Solução (Permanente):**
Implementar armazenamento persistente (requer desenvolvimento adicional).

---

### Erro: Odontograma não carrega

**Sintomas:**
Tela branca ou erro no separador Odontograma

**Solução:**
```bash
# Verificar logs do navegador
# Pressione F12 no navegador e veja a aba Console

# Verificar logs do servidor
tail -50 dentcare.log
```

---

## 6. ERROS DE API/IA

### Erro: "GEMINI_API_KEY não está configurada"

**Sintomas:**
```
Error: GEMINI_API_KEY não está configurada
```

**Causa:** Chave de API não está no ficheiro .env

**Solução:**
```bash
nano .env
```

Adicione:
```
GEMINI_API_KEY=sua_chave_aqui
```

Obtenha a chave em: https://aistudio.google.com/apikey

Depois reinicie o servidor.

---

### Erro: "API key not valid"

**Sintomas:**
```
Error: API key not valid. Please pass a valid API key.
```

**Causa:** Chave de API inválida ou expirada

**Solução:**
1. Acesse https://aistudio.google.com/apikey
2. Gere uma nova chave
3. Atualize o ficheiro `.env`
4. Reinicie o servidor

---

### Erro: Análise de IA dá erro 500

**Sintomas:**
Botão "Analisar Imagem com IA" não responde ou dá erro

**Solução 1 (Verificar logs):**
```bash
tail -100 dentcare.log | grep -i "gemini\|erro\|error"
```

**Solução 2 (Verificar se o helper existe):**
```bash
ls -lh server/gemini-image-helper.ts
```

Se não existir, o ficheiro não foi incluído no pacote.

**Solução 3 (Verificar importação):**
```bash
grep "gemini-image-helper" server/routers.ts
```

Deve retornar a linha com a importação.

---

### Erro: "fetch failed" ou "ENOTFOUND"

**Sintomas:**
```
TypeError: fetch failed
Cause: getaddrinfo ENOTFOUND
```

**Causa:** Sem conexão à internet ou API não acessível

**Solução:**
```bash
# Testar conexão
ping -c 3 google.com

# Verificar DNS
nslookup generativelanguage.googleapis.com
```

---

## 7. PROBLEMAS DE PERFORMANCE

### Problema: Sistema muito lento

**Causa:** Pouca memória RAM ou CPU sobrecarregada

**Solução:**
```bash
# Verificar uso de memória
free -h

# Verificar uso de CPU
top

# Verificar processos Node.js
ps aux | grep node
```

Se tiver pouca memória, considere:
- Fechar outros programas
- Aumentar RAM do servidor
- Usar servidor mais potente

---

### Problema: Build demora muito tempo

**Causa:** Normal em computadores mais lentos

**Solução:**
- Seja paciente (pode demorar 5-10 minutos)
- Não interrompa o processo
- Certifique-se de que tem espaço em disco

```bash
df -h
```

---

### Problema: Upload de imagens falha

**Causa:** Imagem muito grande

**Solução:**
- Reduza o tamanho da imagem antes de fazer upload
- Tamanho recomendado: máximo 5MB
- Formato recomendado: JPEG

---

## 🆘 COMANDOS DE EMERGÊNCIA

### Reiniciar Tudo

```bash
# Parar servidor
pkill -f "node dist/index.js"

# Reiniciar MySQL
sudo systemctl restart mysql

# Limpar cache
cd ~/Downloads/DENTCARE-PRO
rm -rf node_modules dist

# Reinstalar
pnpm install
pnpm build

# Iniciar servidor
NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

---

### Ver Todos os Logs

```bash
# Logs do servidor
tail -100 ~/Downloads/DENTCARE-PRO/dentcare.log

# Logs do MySQL
sudo journalctl -u mysql -n 100

# Logs do sistema
sudo dmesg | tail -50
```

---

### Backup de Emergência

```bash
# Backup da base de dados
mysqldump -u dentcare -pdentcare2024 dentcare_db > backup-emergencia-$(date +%Y%m%d-%H%M%S).sql

# Backup do código
cd ~/Downloads
tar -czf dentcare-backup-$(date +%Y%m%d-%H%M%S).tar.gz DENTCARE-PRO/
```

---

## 📞 QUANDO PEDIR AJUDA

Se nenhuma solução acima funcionou:

1. **Reúna informações:**
   ```bash
   # Versões
   node --version > debug-info.txt
   pnpm --version >> debug-info.txt
   mysql --version >> debug-info.txt
   
   # Logs
   tail -100 dentcare.log >> debug-info.txt
   
   # Status
   ps aux | grep node >> debug-info.txt
   sudo systemctl status mysql >> debug-info.txt
   ```

2. **Descreva o problema:**
   - O que estava a fazer quando o erro ocorreu?
   - Qual mensagem de erro apareceu?
   - Já tentou alguma solução deste guia?

3. **Envie:**
   - O ficheiro `debug-info.txt`
   - Screenshot do erro (se possível)
   - Descrição do problema

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Quando algo não funciona, verifique:

- [ ] MySQL está a correr: `sudo systemctl status mysql`
- [ ] Servidor Node.js está a correr: `ps aux | grep node`
- [ ] Porta está acessível: `curl http://localhost:3000`
- [ ] Ficheiro .env existe e tem as chaves corretas
- [ ] Dependências instaladas: `ls node_modules`
- [ ] Build foi feito: `ls dist`
- [ ] Logs não mostram erros críticos: `tail dentcare.log`

---

**Última atualização:** 16 de Outubro de 2025  
**Versão:** 1.0

