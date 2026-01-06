# 📋 ANÁLISE DAS ESPECIFICAÇÕES - MÓDULO DE CONSULTAS

**Data:** 16 de Outubro de 2025  
**Módulo:** Consultas e Agendamento  
**Status:** Análise Completa

---

## 🎯 REQUISITOS IDENTIFICADOS

### 1. Interface da Agenda

#### Design
- ✅ **Bordas arredondadas** - Sem pontas, visual suave e moderno
- ✅ **Visual limpo** - Interface profissional e agradável
- ✅ **Cores diferenciadas** - Por médico ou tipo de consulta
- ✅ **Responsivo** - Adapta a diferentes tamanhos de tela

#### Visualizações
- ✅ **Vista Semanal** - Calendário com 7 dias
- ✅ **Vista Mensal** - Calendário mensal completo
- ✅ **Vista Diária** - Foco em um único dia
- ✅ **Timeline** - Horários de 8h às 20h

### 2. Funcionalidades de Consultas

#### CRUD Completo
- ✅ **Criar** - Agendar nova consulta
- ✅ **Ler** - Visualizar consultas
- ✅ **Atualizar** - Editar consulta existente
- ✅ **Deletar** - Cancelar/eliminar consulta

#### Status de Consultas (6 opções)
1. **Agendada** - Consulta marcada
2. **Confirmada** - Paciente confirmou presença
3. **Realizada** - Consulta concluída
4. **Cancelada** - Cancelada pela clínica
5. **Faltou** - Paciente não compareceu
6. **Em Atendimento** - Consulta em andamento

#### Informações da Consulta
- Utente (paciente)
- Médico dentista
- Data e hora
- Duração
- Tipo de procedimento
- Status
- Observações
- Valor estimado
- Classificação de risco (ASA)

### 3. Filtros e Pesquisa

- ✅ Filtrar por médico
- ✅ Filtrar por status
- ✅ Filtrar por tipo de procedimento
- ✅ Pesquisar por nome de utente
- ✅ Filtrar por data/período

### 4. Validações

- ✅ Conflito de horários (mesmo médico)
- ✅ Disponibilidade do médico
- ✅ Horário de funcionamento (8h-20h)
- ✅ Duração mínima/máxima
- ✅ Campos obrigatórios

### 5. Estatísticas

- ✅ Total de consultas do dia/semana/mês
- ✅ Consultas confirmadas
- ✅ Taxa de ocupação
- ✅ Receita estimada
- ✅ Taxa de no-show (faltas)

---

## 🎨 DESIGN SPECIFICATIONS

### Cores por Status
```
Agendada:      #3B82F6 (azul)
Confirmada:    #10B981 (verde)
Realizada:     #8B5CF6 (roxo)
Cancelada:     #EF4444 (vermelho)
Faltou:        #F59E0B (laranja)
Em Atendimento: #06B6D4 (ciano)
```

### Bordas Arredondadas
```css
border-radius: 12px;  /* Blocos de consulta */
border-radius: 16px;  /* Cards e modais */
border-radius: 8px;   /* Botões */
```

### Espaçamento
```css
padding: 16px;        /* Interno dos blocos */
gap: 12px;            /* Entre elementos */
margin: 8px;          /* Entre consultas */
```

---

## 🗄️ ESTRUTURA DE DADOS

### Tabela: consultas

```sql
CREATE TABLE consultas (
  id VARCHAR(255) PRIMARY KEY,
  utente_id VARCHAR(255) NOT NULL,
  medico_id VARCHAR(255) NOT NULL,
  data_hora DATETIME NOT NULL,
  duracao INT DEFAULT 30,
  tipo_consulta VARCHAR(100),
  procedimento TEXT,
  status ENUM('agendada', 'confirmada', 'realizada', 'cancelada', 'faltou', 'em_atendimento') DEFAULT 'agendada',
  observacoes TEXT,
  valor_estimado DECIMAL(10,2),
  classificacao_risco VARCHAR(10),
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  atualizado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (utente_id) REFERENCES utentes(id),
  FOREIGN KEY (medico_id) REFERENCES medicos_dentistas(id)
);
```

---

## 📱 COMPONENTES A DESENVOLVER

### 1. Backend (Node.js + tRPC)

#### Rotas tRPC
```typescript
consultas: router({
  listar: protectedProcedure.query()
  obter: protectedProcedure.input(z.object({ id: z.string() })).query()
  criar: protectedProcedure.input(consultaSchema).mutation()
  atualizar: protectedProcedure.input(consultaUpdateSchema).mutation()
  remover: protectedProcedure.input(z.object({ id: z.string() })).mutation()
  listarPorData: protectedProcedure.input(z.object({ data: z.string() })).query()
  listarPorMedico: protectedProcedure.input(z.object({ medicoId: z.string() })).query()
  verificarConflito: protectedProcedure.input(conflitSchema).query()
  estatisticas: protectedProcedure.query()
})
```

#### Funções de BD (MySQL)
- `listarConsultas()`
- `obterConsulta(id)`
- `criarConsulta(dados)`
- `atualizarConsulta(id, dados)`
- `removerConsulta(id)`
- `listarConsultasPorData(data)`
- `listarConsultasPorMedico(medicoId)`
- `verificarConflito(medicoId, dataHora, duracao)`
- `obterEstatisticasConsultas()`

### 2. Frontend (React + TypeScript)

#### Componentes Principais
1. **AgendaView.tsx** - Página principal da agenda
2. **CalendarioSemanal.tsx** - Vista semanal
3. **CalendarioMensal.tsx** - Vista mensal
4. **CalendarioDiario.tsx** - Vista diária
5. **BlocoConsulta.tsx** - Bloco individual de consulta
6. **ModalNovaConsulta.tsx** - Modal para criar consulta
7. **ModalEditarConsulta.tsx** - Modal para editar consulta
8. **FiltrosAgenda.tsx** - Filtros da agenda
9. **EstatisticasAgenda.tsx** - Estatísticas no rodapé
10. **TimelineHorarios.tsx** - Timeline de horários

#### Hooks Personalizados
- `useConsultas()` - Gestão de consultas
- `useAgenda()` - Lógica da agenda
- `useValidacaoConsulta()` - Validações

---

## 🔄 FLUXO DE TRABALHO

### 1. Criar Nova Consulta
```
1. Usuário clica em "Nova Consulta" ou em horário vazio
2. Modal abre com formulário
3. Seleciona utente (autocomplete)
4. Seleciona médico
5. Define data e hora
6. Define duração
7. Seleciona tipo de procedimento
8. Adiciona observações (opcional)
9. Sistema valida conflitos
10. Salva no banco de dados
11. Atualiza agenda em tempo real
12. Mostra notificação de sucesso
```

### 2. Editar Consulta
```
1. Usuário clica em consulta existente
2. Modal abre com dados preenchidos
3. Usuário altera campos desejados
4. Pode mudar status
5. Sistema valida novamente
6. Atualiza no banco de dados
7. Atualiza agenda
8. Mostra notificação
```

### 3. Cancelar Consulta
```
1. Usuário clica em "Cancelar" na consulta
2. Modal de confirmação
3. Opção de adicionar motivo
4. Muda status para "cancelada"
5. Atualiza banco de dados
6. Remove da agenda ou marca como cancelada
7. Notifica usuário
```

---

## ✅ CHECKLIST DE DESENVOLVIMENTO

### Fase 1: Backend (Base de Dados e API)
- [ ] Criar tabela `consultas` no MySQL
- [ ] Implementar funções de BD
- [ ] Criar rotas tRPC
- [ ] Adicionar validações
- [ ] Testar endpoints

### Fase 2: Frontend (Componentes Base)
- [ ] Criar componente `AgendaView`
- [ ] Criar componente `CalendarioSemanal`
- [ ] Criar componente `BlocoConsulta`
- [ ] Criar componente `TimelineHorarios`
- [ ] Estilizar com bordas arredondadas

### Fase 3: Modais e Formulários
- [ ] Criar `ModalNovaConsulta`
- [ ] Criar `ModalEditarConsulta`
- [ ] Implementar validações de formulário
- [ ] Adicionar autocomplete de utentes
- [ ] Adicionar seletor de médico

### Fase 4: Funcionalidades Avançadas
- [ ] Implementar filtros
- [ ] Adicionar pesquisa
- [ ] Criar vistas mensal e diária
- [ ] Adicionar estatísticas
- [ ] Implementar validação de conflitos

### Fase 5: Testes e Refinamentos
- [ ] Testar criação de consultas
- [ ] Testar edição
- [ ] Testar cancelamento
- [ ] Testar filtros
- [ ] Validar design (bordas arredondadas)
- [ ] Testar responsividade

---

## 🎯 PRIORIDADES

### Alta Prioridade
1. ✅ Criar tabela no banco de dados
2. ✅ Implementar CRUD básico (backend)
3. ✅ Criar vista semanal (frontend)
4. ✅ Implementar criação de consultas
5. ✅ Implementar edição de consultas

### Média Prioridade
6. ✅ Adicionar filtros
7. ✅ Implementar validação de conflitos
8. ✅ Criar vistas mensal e diária
9. ✅ Adicionar estatísticas

### Baixa Prioridade
10. ⏳ Drag & Drop (opcional)
11. ⏳ Notificações WhatsApp/SMS (futuro)
12. ⏳ Sincronização com Google Calendar (futuro)

---

## 📝 NOTAS IMPORTANTES

1. **Design sem pontas** - Todos os elementos devem ter `border-radius` adequado
2. **Cores consistentes** - Seguir paleta definida para status
3. **Validações rigorosas** - Evitar conflitos de horário
4. **Performance** - Otimizar para muitas consultas
5. **Responsividade** - Funcionar bem em mobile

---

**Próximo Passo:** Iniciar desenvolvimento do backend (Fase 1)

