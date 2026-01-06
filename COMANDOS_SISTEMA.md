# 🚀 Comandos Úteis - DentCare PRO

Guia rápido de comandos para gestão do sistema.

---

## 🔧 Gestão do Servidor

### Iniciar o Servidor
```bash
cd /home/ubuntu
NODE_ENV=production PORT=3001 node dist/index.js > dentcare.log 2>&1 &
```

### Parar o Servidor
```bash
kill -9 $(ps aux | grep "node dist/index.js" | grep -v grep | awk '{print $2}')
```

### Verificar Status
```bash
ps aux | grep "node dist/index.js" | grep -v grep
```

### Ver Logs em Tempo Real
```bash
tail -f /home/ubuntu/dentcare.log
```

### Ver Últimos 50 Logs
```bash
tail -50 /home/ubuntu/dentcare.log
```

---

## 🏗️ Build e Deploy

### Instalar Dependências
```bash
cd /home/ubuntu
pnpm install
```

### Build do Projeto
```bash
cd /home/ubuntu
pnpm build
```

### Build + Reiniciar
```bash
cd /home/ubuntu
pnpm build && \
kill -9 $(ps aux | grep "node dist/index.js" | grep -v grep | awk '{print $2}') 2>/dev/null && \
sleep 2 && \
NODE_ENV=production PORT=3001 node dist/index.js > dentcare.log 2>&1 &
```

---

## 🗄️ Base de Dados MySQL

### Aceder ao MySQL
```bash
mysql -u dentcare -pdentcare2024 dentcare_db
```

### Listar Tabelas
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SHOW TABLES;"
```

### Contar Utentes
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SELECT COUNT(*) FROM utentes;"
```

### Listar Utentes
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SELECT id, nome, nif FROM utentes LIMIT 10;"
```

### Backup da Base de Dados
```bash
mysqldump -u dentcare -pdentcare2024 dentcare_db > backup-$(date +%Y%m%d-%H%M%S).sql
```

### Restaurar Backup
```bash
mysql -u dentcare -pdentcare2024 dentcare_db < backup-20251016-161030.sql
```

---

## 🔍 Debugging

### Verificar Variáveis de Ambiente
```bash
grep -E "GEMINI|XAI|OPENAI|DATABASE" /home/ubuntu/.env
```

### Verificar Porta em Uso
```bash
netstat -tuln | grep 3001
```

### Testar Conexão HTTP
```bash
curl -s -o /dev/null -w "HTTP Status: %{http_code}\n" http://localhost:3001
```

### Verificar Logs de Erro
```bash
tail -100 /home/ubuntu/dentcare.log | grep -i "error\|erro"
```

### Verificar Logs da IA
```bash
tail -100 /home/ubuntu/dentcare.log | grep -i "gemini\|ia"
```

---

## 📁 Gestão de Ficheiros

### Listar Estrutura do Projeto
```bash
cd /home/ubuntu
tree -L 2 -I 'node_modules|dist'
```

### Verificar Tamanho do Build
```bash
du -sh /home/ubuntu/dist
ls -lh /home/ubuntu/dist/
```

### Limpar Cache
```bash
cd /home/ubuntu
rm -rf node_modules/.cache
rm -rf dist
```

---

## 🧪 Testes

### Testar API de Análise de Imagem
```bash
curl -X POST http://localhost:3001/api/trpc/analisarImagem \
  -H "Content-Type: application/json" \
  -d '{"imagemBase64":"...","tipoImagem":"raio_x"}'
```

### Verificar Dependências
```bash
cd /home/ubuntu
pnpm list --depth=0
```

---

## 🔐 Segurança

### Verificar Permissões
```bash
ls -la /home/ubuntu/.env
```

### Verificar Processos Node
```bash
ps aux | grep node
```

---

## 📊 Monitorização

### Uso de Memória
```bash
free -h
```

### Uso de Disco
```bash
df -h
```

### Processos por Memória
```bash
ps aux --sort=-%mem | head -10
```

---

## 🌐 Acesso

**URL do Sistema:** https://3001-invq3spqvc64i0cnkdr7p-c203595d.manusvm.computer

**Base de Dados:**
- Host: localhost
- Database: dentcare_db
- User: dentcare
- Password: dentcare2024
- Port: 3306

---

## 💡 Dicas Úteis

### Reinício Rápido
```bash
cd /home/ubuntu && \
pkill -f "node dist/index.js" && \
sleep 1 && \
NODE_ENV=production PORT=3001 node dist/index.js > dentcare.log 2>&1 & \
echo "✅ Servidor reiniciado"
```

### Ver Logs com Cores
```bash
tail -f /home/ubuntu/dentcare.log | grep --color=always -E "✅|❌|🤖|📊|🚀|$"
```

### Backup Completo
```bash
cd /home/ubuntu && \
tar -czf backup-completo-$(date +%Y%m%d-%H%M%S).tar.gz \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.git' \
  . && \
mysqldump -u dentcare -pdentcare2024 dentcare_db > db-backup-$(date +%Y%m%d-%H%M%S).sql && \
echo "✅ Backup completo criado"
```

---

**Última atualização:** 16 de Outubro de 2025

