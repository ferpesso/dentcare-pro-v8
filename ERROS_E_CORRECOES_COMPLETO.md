# 🔧 ERROS ENCONTRADOS E CORREÇÕES APLICADAS - DentCare PRO

**Data:** 16 de outubro de 2025  
**Versão:** 1.0 com Módulo de Consultas/Agenda

---

## 📋 ÍNDICE

1. [Erros Corrigidos Durante o Desenvolvimento](#erros-corrigidos)
2. [Problemas Conhecidos e Soluções](#problemas-conhecidos)
3. [Como Corrigir Cada Erro](#como-corrigir)
4. [Checklist de Verificação](#checklist)

---

## ✅ ERROS CORRIGIDOS DURANTE O DESENVOLVIMENTO

### ERRO 1: Pesquisa de Pacientes Crashava o Sistema
**Sintoma:** Ao pesquisar pacientes, o sistema dava erro e parava de funcionar.

**Causa:** Campos opcionais (`telefone`, `email`, etc.) não tinham proteção contra valores `null` ou `undefined`.

**Correção Aplicada:**
```typescript
// ANTES (com erro):
paciente.telefone.toLowerCase()

// DEPOIS (corrigido):
paciente.telefone?.toLowerCase()
```

**Arquivo:** `/client/src/pages/Utentes.tsx`

**Status:** ✅ CORRIGIDO

---

### ERRO 2: Análise de Imagem com IA Retornava Erro 500
**Sintoma:** Ao clicar em "Analisar Imagem com IA", retornava erro 500.

**Causa:** A variável `GEMINI_API_KEY` não estava configurada no arquivo `.env`.

**Correção Aplicada:**
1. Adicionar no arquivo `.env`:
```bash
GEMINI_API_KEY=sua_chave_aqui
```

2. Reiniciar o servidor após adicionar a chave.

**Arquivo:** `/.env`

**Status:** ✅ CORRIGIDO

---

### ERRO 3: Imagens Perdidas Após Reiniciar o Servidor
**Sintoma:** Imagens carregadas desapareciam ao reiniciar o servidor.

**Causa:** Imagens eram armazenadas em memória temporária.

**Correção Aplicada:**
1. Implementado sistema de persistência em disco
2. Criada pasta `uploads/imagens/` para armazenamento permanente
3. Adicionadas rotas para servir imagens estáticas

**Arquivos Modificados:**
- `/server/_core/routers.ts` - Adicionadas rotas de imagens
- `/server/image-storage.ts` - Sistema de armazenamento
- `/server/routers-imagens.ts` - Rotas de upload/download

**Status:** ✅ CORRIGIDO

---

### ERRO 4: SelectItem com Value Vazio Causava Crash
**Sintoma:** Ao abrir modal de consulta, aparecia erro: "A <Select.Item /> must have a value prop that is not an empty string"

**Causa:** Componente Select do Radix UI não aceita `value=""` vazio.

**Correção Aplicada:**
```typescript
// ANTES (com erro):
<SelectItem value="">Nenhum</SelectItem>

// DEPOIS (corrigido):
<SelectItem value="__none__">Nenhum</SelectItem>

// E ao salvar:
medicoId: formData.medicoId && formData.medicoId !== "__none__" ? formData.medicoId : null
```

**Arquivos:**
- `/client/src/components/ModalNovaConsulta.tsx`
- `/client/src/components/ModalEditarConsulta.tsx`

**Status:** ✅ CORRIGIDO

---

### ERRO 5: Rotas de Consultas Não Encontradas (404)
**Sintoma:** Ao acessar `/agenda`, retornava 404.

**Causa:** Rota não estava registrada no `App.tsx` e no menu lateral.

**Correção Aplicada:**
1. Adicionar rota em `/client/src/App.tsx`:
```typescript
<Route path={"/agenda"} component={Agenda} />
```

2. Adicionar item no menu em `/client/src/components/DashboardLayout.tsx`:
```typescript
{ icon: Calendar, label: "Agenda", path: "/agenda" }
```

**Status:** ✅ CORRIGIDO

---

### ERRO 6: Imports Relativos Incorretos Após Mover Arquivos
**Sintoma:** Erro de build: "Cannot resolve module '../routers'"

**Causa:** Arquivos movidos para `_core/` mas imports não foram atualizados.

**Correção Aplicada:**
```typescript
// ANTES:
import { COOKIE_NAME } from "./_core/constants";

// DEPOIS:
import { COOKIE_NAME } from "../../shared/const";
```

**Arquivos Afetados:**
- `/server/_core/routers.ts`
- `/server/_core/routers-imagens.ts`

**Status:** ✅ CORRIGIDO

---

## 🚨 PROBLEMAS CONHECIDOS E SOLUÇÕES

### PROBLEMA 1: Servidor Inicia na Porta 3001 em Vez de 3000
**Sintoma:** Mensagem "Port 3000 is busy, using port 3001 instead"

**Causa:** Processo anterior ainda está rodando na porta 3000.

**Solução:**
```bash
# 1. Encontrar o processo
ps aux | grep "node dist/index.js" | grep -v grep

# 2. Matar o processo (substitua XXXX pelo PID)
kill XXXX

# 3. Aguardar 2 segundos
sleep 2

# 4. Iniciar novamente
cd /home/ubuntu && NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

---

### PROBLEMA 2: Erro 400 ao Carregar Consultas
**Sintoma:** Console mostra "Failed to load resource: 400"

**Causa:** Query tRPC está falhando, geralmente por falta de autenticação ou erro na query.

**Solução:**
1. Verificar se o utilizador está autenticado (fazer login novamente)
2. Verificar logs do servidor:
```bash
tail -50 /home/ubuntu/dentcare.log
```
3. Verificar se a tabela `consultas` existe:
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "SHOW TABLES;"
```

---

### PROBLEMA 3: MySQL Não Inicia
**Sintoma:** Erro "Can't connect to MySQL server"

**Solução:**
```bash
# Iniciar MySQL
sudo systemctl start mysql

# Verificar status
sudo systemctl status mysql

# Se não funcionar, reinstalar
sudo apt update
sudo DEBIAN_FRONTEND=noninteractive apt install -y mysql-server
```

---

### PROBLEMA 4: Dependências Não Instalam (pnpm install falha)
**Sintoma:** Erro durante `pnpm install`

**Solução:**
```bash
# Limpar cache
rm -rf node_modules
rm -rf ~/.pnpm-store

# Reinstalar
pnpm install --no-frozen-lockfile
```

---

## 🔧 COMO CORRIGIR CADA ERRO

### Se o Sistema Não Carregar (Tela Branca)

**Passo 1:** Verificar console do navegador (F12)
```
Se aparecer erro de módulo não encontrado:
→ Fazer rebuild: pnpm build
```

**Passo 2:** Verificar se o servidor está rodando
```bash
ps aux | grep "node dist/index.js"
```

**Passo 3:** Verificar logs
```bash
tail -50 /home/ubuntu/dentcare.log
```

---

### Se a Agenda Não Carregar Consultas

**Passo 1:** Verificar se a tabela existe
```bash
mysql -u dentcare -pdentcare2024 dentcare_db -e "DESCRIBE consultas;"
```

**Passo 2:** Se a tabela não existir, criar:
```bash
mysql -u dentcare -pdentcare2024 dentcare_db < /home/ubuntu/consultas-schema.sql
```

**Passo 3:** Reiniciar servidor
```bash
# Matar processo
ps aux | grep "node dist/index.js" | grep -v grep | awk '{print $2}' | xargs kill

# Aguardar
sleep 2

# Iniciar
cd /home/ubuntu && NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

---

### Se Aparecer Erro de Permissões

**Solução:**
```bash
# Dar permissões corretas
sudo chown -R ubuntu:ubuntu /home/ubuntu
chmod -R 755 /home/ubuntu
```

---

### Se o Build Falhar

**Passo 1:** Limpar e reinstalar
```bash
rm -rf node_modules dist
pnpm install
```

**Passo 2:** Verificar versão do Node
```bash
node --version
# Deve ser v22.13.0 ou superior
```

**Passo 3:** Build novamente
```bash
pnpm build
```

---

## ✅ CHECKLIST DE VERIFICAÇÃO

Antes de fazer deploy em outro computador, verificar:

### Pré-requisitos
- [ ] Ubuntu 22.04 ou superior
- [ ] Node.js v22.13.0 instalado
- [ ] pnpm instalado
- [ ] MySQL 8.0 instalado
- [ ] Porta 3000 disponível

### Arquivos Necessários
- [ ] Código fonte completo (DENTCARE-PRO-COMPLETO-FINAL.tar.gz)
- [ ] Backup da base de dados (dentcare-db-backup-FINAL.sql)
- [ ] Arquivo .env configurado
- [ ] Documentação de instalação

### Após Instalação
- [ ] MySQL rodando
- [ ] Base de dados criada e restaurada
- [ ] Dependências instaladas (pnpm install)
- [ ] Build concluído (pnpm build)
- [ ] Servidor iniciado
- [ ] Acesso via navegador funcional
- [ ] Login funcional
- [ ] Utentes carregam
- [ ] Agenda carrega
- [ ] Imagens persistem após reiniciar

---

## 📞 RESUMO DOS COMANDOS IMPORTANTES

### Verificar Status
```bash
# MySQL
sudo systemctl status mysql

# Servidor Node
ps aux | grep "node dist/index.js"

# Logs
tail -f /home/ubuntu/dentcare.log
```

### Reiniciar Tudo
```bash
# Parar servidor
ps aux | grep "node dist/index.js" | grep -v grep | awk '{print $2}' | xargs kill

# Reiniciar MySQL
sudo systemctl restart mysql

# Iniciar servidor
cd /home/ubuntu && NODE_ENV=production PORT=3000 node dist/index.js > dentcare.log 2>&1 &
```

### Rebuild Completo
```bash
cd /home/ubuntu
rm -rf node_modules dist
pnpm install
pnpm build
```

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS E TESTADAS

### ✅ Módulo de Utentes
- Listagem de pacientes
- Pesquisa (com correção de campos opcionais)
- Criação/Edição/Remoção
- Upload de imagens (com persistência)
- Análise de imagens com IA (Google Gemini)
- Odontograma digital

### ✅ Módulo de Consultas/Agenda (NOVO)
- Calendário semanal com bordas arredondadas
- Navegação por semanas
- Criação de consultas
- 6 status diferentes (Agendada, Confirmada, Realizada, Cancelada, Faltou, Em Atendimento)
- Validação de conflitos de horário
- Estatísticas em tempo real
- Filtros por médico e status

### ⏳ Módulos Pendentes
- Tratamentos
- Orçamentos
- Faturação
- Relatórios
- Backup Automático
- Notificações

---

**IMPORTANTE:** Este documento deve ser mantido junto com o código fonte para referência futura.

