# 🦷 DentCare Pro - Sistema de Gestão Dentária

Sistema completo de gestão para clínicas dentárias em Portugal, com funcionalidades avançadas de **Inteligência Artificial**.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-22.x-brightgreen)

---

## ✨ Funcionalidades Principais

### 👥 Gestão de Utentes (Pacientes)
- Ficha completa com dados pessoais e médicos
- Informações médicas (alergias, medicamentos, condições)
- Pesquisa avançada multi-campo
- Estatísticas em tempo real

### 🦷 Módulos Clínicos
- **Odontograma 3D** - Visualização interativa dos dentes
- **Periodontograma** - Registo de sondagem periodontal
- **Endodontia** - Tratamentos de canal
- **Implantes** - Gestão de implantes dentários
- **Ortodontia** - Planos e aparelhos ortodônticos
- **Imagens** - Upload e visualização de raios-X
- **Laboratório** - Gestão de trabalhos laboratoriais
- **Prescrições** - Criação rápida de prescrições

### 🤖 Inteligência Artificial (Grok)
- **Assistente de Diagnóstico** - Analisa sintomas e sugere diagnósticos
- **Verificador de Medicamentos** - Detecta alergias e interações perigosas
- **Gerador de Resumos** - Cria resumos automáticos de consultas
- **Análise de Risco** - Avalia nível de risco do paciente
- **Assistente Virtual** - Chatbot que responde perguntas sobre o paciente

---

## 🚀 Início Rápido

### Requisitos

- Node.js 22.x ou superior
- pnpm (gerenciador de pacotes)
- MySQL ou TiDB
- Chave API do Grok (xAI)

### Instalação

```bash
# 1. Clonar/Extrair o projeto
cd dentcare-pro

# 2. Instalar dependências
pnpm install

# 3. Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# 4. Criar tabelas na base de dados
pnpm db:push

# 5. (Opcional) Inserir dados de exemplo
pnpm tsx scripts/seed-utentes.ts

# 6. Iniciar servidor
pnpm dev
```

Aceder: `http://localhost:3000`

---

## 📚 Documentação

- **[DOCUMENTACAO_COMPLETA.md](./DOCUMENTACAO_COMPLETA.md)** - Documentação técnica completa
- **[GUIA_DEPLOY.md](./GUIA_DEPLOY.md)** - Guia passo-a-passo de deploy
- **[MAPA_HERANCA.md](./MAPA_HERANCA.md)** - Como os dados fluem no sistema
- **[ERROS_E_SOLUCOES.md](./ERROS_E_SOLUCOES.md)** - Troubleshooting completo

---

## 🏗️ Tecnologias

### Frontend
- **React 19** - Framework UI
- **TypeScript** - Linguagem tipada
- **Tailwind CSS 4** - Estilização
- **shadcn/ui** - Componentes UI
- **tRPC** - Type-safe API

### Backend
- **Node.js 22** - Runtime
- **Express 4** - Servidor HTTP
- **tRPC 11** - API type-safe
- **Drizzle ORM** - ORM para MySQL

### Base de Dados
- **MySQL / TiDB** - Base de dados relacional

### IA
- **Grok (xAI)** - Inteligência Artificial

### Outros
- **S3** - Storage de imagens
- **Manus OAuth** - Autenticação

---

## 📁 Estrutura do Projeto

```
dentcare-pro/
├── client/                 # Frontend React
│   ├── public/            # Assets estáticos
│   └── src/
│       ├── components/    # Componentes reutilizáveis
│       ├── pages/        # Páginas principais
│       └── lib/          # Configurações (tRPC)
├── server/                # Backend Node.js
│   ├── _core/            # Framework (NÃO EDITAR)
│   ├── db.ts             # Funções de base de dados
│   ├── routers.ts        # Rotas tRPC
│   └── ai-helper.ts      # Funções de IA
├── drizzle/              # Schema e migrações
│   └── schema.ts         # Definição das tabelas
├── scripts/              # Scripts auxiliares
└── shared/               # Constantes partilhadas
```

---

## ⚙️ Configuração

### Variáveis de Ambiente (.env)

```bash
# Base de Dados (OBRIGATÓRIO)
DATABASE_URL=mysql://user:password@host:port/database

# IA (OBRIGATÓRIO para funcionalidades de IA)
XAI_API_KEY=xai-sua-chave-aqui

# Autenticação
JWT_SECRET=secret-aleatorio-seguro
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
VITE_APP_ID=seu-app-id
OWNER_OPEN_ID=seu-open-id
OWNER_NAME=Seu Nome

# Storage S3
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua-chave-api

# App
VITE_APP_TITLE=DentCare Pro - Sistema de Gestão Dentária
VITE_APP_LOGO=/logo.svg
```

---

## 🧪 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev              # Iniciar servidor de desenvolvimento

# Produção
pnpm build            # Compilar para produção
pnpm start            # Iniciar servidor de produção

# Base de Dados
pnpm db:push          # Criar/atualizar tabelas
pnpm db:studio        # Abrir Drizzle Studio (GUI)

# Utilitários
pnpm tsx scripts/seed-utentes.ts  # Inserir dados de exemplo
```

---

## 🎯 Funcionalidades de IA

### 1. Assistente de Diagnóstico

Analisa sintomas do paciente e sugere possíveis diagnósticos.

**Exemplo**:
```
Input: "Dor no dente 36, sensibilidade ao frio, gengiva inchada"
Output: 
- Pulpite reversível (70%)
- Cárie profunda (60%)
- Gengivite (50%)
```

### 2. Verificador de Medicamentos

Verifica segurança de medicamentos considerando alergias e interações.

**Exemplo**:
```
Input: Amoxicilina 500mg
Alergias: Penicilina
Output: ⚠️ ALERTA! Amoxicilina é uma penicilina. CONTRAINDICADO!
Alternativas: Azitromicina, Claritromicina
```

### 3. Gerador de Resumos

Cria resumos profissionais de consultas.

**Exemplo**:
```
Input: "Paciente queixou-se de dor no dente 36..."
Output: Resumo estruturado com:
- Queixa principal
- Exame clínico
- Diagnóstico
- Tratamento realizado
- Próximos passos
```

### 4. Análise de Risco

Avalia nível de risco do paciente.

**Exemplo**:
```
Output:
- Nível: MÉDIO
- Fatores: Diabetes, Hipertensão, ASA III
- Recomendações: Controlo glicémico antes de procedimentos
```

### 5. Assistente Virtual

Chatbot que responde perguntas sobre o paciente.

**Exemplo**:
```
Pergunta: "Quais são as alergias deste paciente?"
Resposta: "O paciente tem alergia a Penicilina e Sulfa."
```

---

## 🔒 Segurança

- ✅ Autenticação OAuth
- ✅ Rotas protegidas com tRPC
- ✅ Validação de inputs com Zod
- ✅ Sanitização de dados
- ✅ HTTPS em produção

---

## 📊 Base de Dados

### Tabelas Principais

- `users` - Utilizadores do sistema
- `utentes` - Pacientes (com campo JSON para info médica)
- `odontograma` - Estado dos dentes
- `periodontograma` - Medições periodontais
- `endodontia` - Tratamentos de canal
- `implantes` - Implantes dentários
- `ortodontia` - Tratamentos ortodônticos
- `imagens` - Raios-X e fotografias
- `laboratorio` - Trabalhos laboratoriais
- `prescricoes` - Prescrições médicas

---

## 🐛 Resolução de Problemas

### Erro: "Cannot connect to database"

```bash
# Verificar DATABASE_URL no .env
# Formato: mysql://user:password@host:port/database
```

### Erro: "XAI_API_KEY is not defined"

```bash
# Adicionar chave ao .env
XAI_API_KEY=xai-sua-chave-aqui
```

### Erro: "Port 3000 already in use"

```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

**Ver mais soluções em**: [ERROS_E_SOLUCOES.md](./ERROS_E_SOLUCOES.md)

---

## 📈 Roadmap

### Próximas Funcionalidades

- [ ] Módulo de Consultas (agendamento)
- [ ] Módulo de Tratamentos (planos)
- [ ] Módulo de Orçamentos
- [ ] Módulo de Faturação
- [ ] Relatórios e estatísticas avançadas
- [ ] Integração com sistemas de pagamento
- [ ] App móvel (React Native)

---

## 🤝 Contribuir

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

---

## 📝 Licença

Este projeto está sob a licença MIT. Ver ficheiro `LICENSE` para mais detalhes.

---

## 📞 Suporte

- **Documentação**: Ver ficheiros `.md` na raiz do projeto
- **Issues**: Abrir issue no repositório
- **Email**: suporte@dentcarepro.pt

---

## 🎓 Créditos

Desenvolvido com ❤️ para clínicas dentárias em Portugal.

**Tecnologias utilizadas**:
- React, TypeScript, Tailwind CSS
- Node.js, Express, tRPC
- MySQL, Drizzle ORM
- Grok (xAI)

---

## ⭐ Funcionalidades Destacadas

### 🤖 IA Real e Funcional

Todas as funcionalidades de IA usam o **Grok (xAI)** e estão **100% operacionais**. Não são simulações!

### 🦷 Odontograma 3D

Visualização interativa dos dentes com efeito de profundidade e cores para diferentes estados.

### 💊 Verificação Inteligente

O sistema **detecta automaticamente** alergias e interações perigosas ao prescrever medicamentos.

### ⚡ Rapidez no Preenchimento

Templates rápidos para prescrições, dropdowns inteligentes e campos pré-preenchidos para economizar tempo.

---

**DentCare Pro - Gestão Inteligente para Clínicas Dentárias** 🦷✨

