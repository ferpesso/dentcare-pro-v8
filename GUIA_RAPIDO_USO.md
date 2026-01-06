# 📖 Guia Rápido de Uso - DentCare PRO v8.0

## 🌐 Acesso ao Sistema

**URL:** https://3001-i6txsve9iw6uuoosge53g-46dbd963.manusvm.computer

---

## 🎯 Funcionalidades Disponíveis

### 1. Dashboard Principal
- Visão geral do sistema
- Acesso rápido aos módulos
- Estatísticas em tempo real

### 2. Módulo Utentes (Pacientes)
**Funcionalidades:**
- ✅ Listar todos os utentes
- ✅ Ver ficha completa de utente
- ✅ Informações médicas (alergias, medicamentos, etc.)
- ✅ Histórico de consultas
- ⏳ Criar novo utente (em desenvolvimento)
- ⏳ Editar utente (em desenvolvimento)

**Como usar:**
1. Clicar em "Utentes" no dashboard
2. Clicar em "Ver" para abrir a ficha
3. Navegar pelos tabs: Geral, Médico, Odontograma, etc.

### 3. Módulo Consultas (Agenda)
**Funcionalidades:**
- ✅ Visualizar agenda (dia/semana/mês)
- ✅ Ver consultas agendadas
- ✅ Editar consulta existente
- ✅ Estatísticas de consultas
- ✅ Filtrar por status
- ✅ Pesquisar paciente
- ✅ Drag and drop (arrastar consultas)
- ⏳ Criar nova consulta (em desenvolvimento)

**Como usar:**
1. Clicar em "Consultas" no dashboard
2. Navegar entre dias/semanas/meses
3. Clicar numa consulta para editar
4. Arrastar consulta para reagendar (drag and drop)

### 4. Módulos em Desenvolvimento
- ⏳ Tratamentos (Odontograma, Periodontograma)
- ⏳ Orçamentos
- ⏳ Faturação

---

## 🔧 Gestão do Sistema

### Verificar Status
```bash
pm2 status
```

### Ver Logs em Tempo Real
```bash
pm2 logs dentcare-pro
```

### Reiniciar Sistema
```bash
pm2 restart dentcare-pro
```

### Parar Sistema
```bash
pm2 stop dentcare-pro
```

### Iniciar Sistema
```bash
pm2 start dentcare-pro
```

---

## 📊 Dados Mock Disponíveis

### Utentes (5)
1. Maria Silva Santos (utente-001)
2. João Pedro Costa (utente-002)
3. Ana Rita Ferreira (utente-003)
4. Carlos Manuel Oliveira (utente-004)
5. Sofia Marques Rodrigues (utente-005)

### Consultas (4 hoje)
1. 09:00 - Maria Silva Santos - Consulta de Rotina
2. 10:30 - João Pedro Costa - Restauração
3. 14:00 - Ana Rita Ferreira - Implante
4. 16:00 - Carlos Manuel Oliveira - Consulta de Rotina

---

## ⚠️ Limitações Atuais

1. **Dados não persistem após reinício** - Sistema usa dados mock em memória
2. **Sem autenticação** - Acesso livre (modo desenvolvimento)
3. **Sem MySQL** - Base de dados desativada (usa mock)
4. **Alguns módulos incompletos** - Tratamentos, Orçamentos, Faturação

---

## 🚀 Próximos Passos

### Para Produção Real:
1. Instalar e configurar MySQL
2. Descomentar `DATABASE_URL` no `.env`
3. Executar migrations da base de dados
4. Implementar autenticação de utilizadores
5. Configurar backup automático

### Para Desenvolvimento:
1. Implementar criação de utentes
2. Implementar criação de consultas
3. Testar drag and drop extensivamente
4. Implementar módulo Tratamentos
5. Implementar módulo Orçamentos

---

## 📞 Suporte

**Repositório GitHub:** https://github.com/ferpesso/dentcare-pro-v8  
**Documentação Completa:** Ver `RELATORIO_FINAL_CORRECOES.md`  
**Bugs Conhecidos:** Ver `BUGS_CORRIGIDOS_AGENDA.md`

---

**Última Atualização:** 17 de outubro de 2025  
**Versão:** DentCare PRO v8.0  
**Status:** ✅ Online e Funcional

