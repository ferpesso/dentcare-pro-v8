# Guia de Instalação e Configuração - DentCare Pro 8.0

Este documento contém todas as instruções necessárias para instalar, configurar e executar o sistema DentCare Pro 8.0 no seu ambiente.

## 1. Pré-requisitos

Antes de começar, certifique-se de ter instalado:
- **Node.js** (v18 ou superior)
- **pnpm** (recomendado) ou npm/yarn
- **MySQL** ou **TiDB** (para o banco de dados)

## 2. Instalação

1. Extraia o conteúdo do arquivo ZIP para uma pasta.
2. Abra o terminal na pasta do projeto.
3. Instale as dependências:
   ```bash
   pnpm install
   ```

## 3. Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Base de Dados
DATABASE_URL=mysql://utilizador:senha@localhost:3306/dentcare_db

# Autenticação (Se aplicável)
AUTH_SECRET=uma_chave_secreta_longa_e_segura

# APIs Externas (Configurar para produção)
WHATSAPP_API_KEY=sua_chave_aqui
PEM_CERTIFICATE_PATH=caminho/para/certificado.pfx
OPENAI_API_KEY=sua_chave_para_ia_radiografica
```

## 4. Preparação do Banco de Dados

Execute as migrações para criar as tabelas necessárias:
```bash
pnpm db:push
```

## 5. Execução

Para iniciar o sistema em modo de desenvolvimento:
```bash
pnpm dev
```

O sistema estará disponível em `http://localhost:5173`.

## 6. Funcionalidades Implementadas

O pacote inclui:
- **Gestão de Utentes e Agenda** (Totalmente funcional)
- **Odontograma 3D e Tratamentos** (Interativo)
- **Prescrições e PEM** (Interface de integração pronta)
- **Gestão de Stocks** (Módulo completo)
- **Lembretes WhatsApp** (Lógica de automação)
- **Análise Radiográfica por IA** (Módulo de diagnóstico assistido)
- **Segurança e RGPD** (Logs de auditoria e conformidade)

## 7. Suporte e Manutenção

O código está estruturado em:
- `/client`: Interface React (Vite + TailwindCSS)
- `/server`: Backend Node.js (tRPC + Drizzle ORM)
- `/shared`: Tipagens e constantes partilhadas

---
*Desenvolvido e atualizado por Manus AI para DentCare Pro.*
