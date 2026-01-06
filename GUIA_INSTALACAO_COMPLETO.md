# 📦 Guia de Instalação Completo - DentCare PRO v8.0

## 🎯 Para Quem Não Sabe Programar

Este guia foi feito para você que **não sabe programar** e quer instalar o sistema DentCare PRO num computador novo. Siga os passos **exatamente como estão escritos**.

---

## ⚠️ IMPORTANTE - LEIA ANTES DE COMEÇAR

### O Que Você Vai Precisar:
1. ✅ Computador com Windows, Mac ou Linux
2. ✅ Ligação à internet
3. ✅ 30 minutos de tempo
4. ✅ Paciência para seguir os passos

### O Que Você NÃO Precisa:
- ❌ Saber programar
- ❌ Ter experiência com servidores
- ❌ Instalar MySQL (o sistema funciona sem base de dados)

---

## 📋 PASSO 1: Instalar o Node.js

### Windows:
1. Abra o navegador
2. Vá para: https://nodejs.org/
3. Clique no botão verde "Download Node.js (LTS)"
4. Quando terminar o download, clique duas vezes no ficheiro
5. Clique em "Next" até terminar a instalação
6. **IMPORTANTE:** Reinicie o computador

### Mac:
1. Abra o navegador
2. Vá para: https://nodejs.org/
3. Clique no botão verde "Download Node.js (LTS)"
4. Quando terminar o download, clique duas vezes no ficheiro .pkg
5. Siga as instruções até terminar
6. **IMPORTANTE:** Reinicie o computador

### Linux (Ubuntu/Debian):
1. Abra o Terminal (Ctrl+Alt+T)
2. Cole este comando e pressione Enter:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Aguarde terminar

---

## 📋 PASSO 2: Verificar se o Node.js está instalado

### Windows:
1. Pressione a tecla Windows
2. Escreva "cmd" e pressione Enter
3. Na janela preta que abrir, escreva:
   ```
   node --version
   ```
4. Deve aparecer algo como: `v22.13.0`
5. Se aparecer, está tudo bem! Pode fechar a janela.

### Mac/Linux:
1. Abra o Terminal
2. Escreva:
   ```bash
   node --version
   ```
3. Deve aparecer algo como: `v22.13.0`
4. Se aparecer, está tudo bem!

**Se não aparecer a versão:** Volte ao PASSO 1 e tente novamente.

---

## 📋 PASSO 3: Instalar o pnpm

O pnpm é um programa que ajuda a instalar outros programas necessários.

### Windows (CMD):
1. Abra o CMD novamente (tecla Windows, escreva "cmd")
2. Cole este comando e pressione Enter:
   ```
   npm install -g pnpm
   ```
3. Aguarde terminar (pode demorar 1-2 minutos)

### Mac/Linux (Terminal):
1. Abra o Terminal
2. Cole este comando e pressione Enter:
   ```bash
   npm install -g pnpm
   ```
3. Aguarde terminar

---

## 📋 PASSO 4: Descarregar o Código do Sistema

Você recebeu um ficheiro chamado `DENTCARE_PRO_V8_FINAL.tar.gz`. 

### Windows:
1. Clique com o botão direito no ficheiro
2. Escolha "Extrair Aqui" ou "Extract Here"
3. Se não aparecer essa opção, instale o 7-Zip: https://www.7-zip.org/
4. Depois de extrair, vai aparecer uma pasta chamada `dentcare-pro`

### Mac:
1. Clique duas vezes no ficheiro
2. Vai aparecer uma pasta chamada `dentcare-pro`

### Linux:
1. Abra o Terminal na pasta onde está o ficheiro
2. Execute:
   ```bash
   tar -xzf DENTCARE_PRO_V8_FINAL.tar.gz
   ```

---

## 📋 PASSO 5: Entrar na Pasta do Sistema

### Windows:
1. Abra o CMD
2. Escreva (substitua `C:\Users\SeuNome\Downloads` pelo caminho onde extraiu):
   ```
   cd C:\Users\SeuNome\Downloads\dentcare-pro
   ```
3. Pressione Enter

### Mac:
1. Abra o Terminal
2. Escreva (substitua `/Users/SeuNome/Downloads` pelo caminho onde extraiu):
   ```bash
   cd /Users/SeuNome/Downloads/dentcare-pro
   ```
3. Pressione Enter

### Linux:
1. Abra o Terminal
2. Escreva (substitua `/home/seunome/Downloads` pelo caminho onde extraiu):
   ```bash
   cd /home/seunome/Downloads/dentcare-pro
   ```
3. Pressione Enter

---

## 📋 PASSO 6: Instalar as Dependências

**ATENÇÃO:** Este passo pode demorar 5-10 minutos. **NÃO FECHE A JANELA!**

### Todos os Sistemas:
1. Na janela do CMD/Terminal, escreva:
   ```bash
   pnpm install
   ```
2. Pressione Enter
3. Aguarde até aparecer "Done" ou terminar
4. **Vai aparecer muitas linhas de texto - é normal!**

---

## 📋 PASSO 7: Construir o Sistema

Este passo prepara o sistema para funcionar.

### Todos os Sistemas:
1. Na mesma janela, escreva:
   ```bash
   pnpm build
   ```
2. Pressione Enter
3. Aguarde até terminar (1-2 minutos)

---

## 📋 PASSO 8: Instalar o PM2 (Gestor de Processos)

O PM2 mantém o sistema sempre ligado.

### Todos os Sistemas:
1. Na mesma janela, escreva:
   ```bash
   npm install -g pm2
   ```
2. Pressione Enter
3. Aguarde terminar

---

## 📋 PASSO 9: Iniciar o Sistema

### Todos os Sistemas:
1. Na mesma janela, escreva:
   ```bash
   pm2 start ecosystem.config.cjs
   ```
2. Pressione Enter
3. Deve aparecer uma tabela com o sistema "online"

---

## 📋 PASSO 10: Salvar a Configuração

Para o sistema iniciar automaticamente:

### Todos os Sistemas:
1. Escreva:
   ```bash
   pm2 save
   pm2 startup
   ```
2. Se aparecer um comando grande, copie e cole na janela
3. Pressione Enter

---

## 🎉 PASSO 11: Aceder ao Sistema

1. Abra o navegador (Chrome, Firefox, Edge, Safari)
2. Vá para: **http://localhost:3001**
3. O sistema deve aparecer!

---

## 🔧 Comandos Úteis

### Ver se o sistema está a funcionar:
```bash
pm2 status
```

### Ver os logs (erros):
```bash
pm2 logs dentcare-pro
```

### Reiniciar o sistema:
```bash
pm2 restart dentcare-pro
```

### Parar o sistema:
```bash
pm2 stop dentcare-pro
```

### Iniciar o sistema:
```bash
pm2 start dentcare-pro
```

---

## ❌ Problemas Comuns e Soluções

### Problema 1: "node: command not found"
**Solução:** O Node.js não está instalado. Volte ao PASSO 1.

### Problema 2: "pnpm: command not found"
**Solução:** O pnpm não está instalado. Volte ao PASSO 3.

### Problema 3: "Port 3001 is already in use"
**Solução:** Já existe algo a usar a porta 3001. Execute:
```bash
pm2 stop all
pm2 start dentcare-pro
```

### Problema 4: "Cannot find module"
**Solução:** As dependências não foram instaladas. Volte ao PASSO 6.

### Problema 5: Página não carrega no navegador
**Solução:** 
1. Verifique se o sistema está online: `pm2 status`
2. Se estiver "stopped", execute: `pm2 start dentcare-pro`
3. Aguarde 10 segundos e tente novamente

### Problema 6: "Erro ao carregar utente"
**Solução:** Este erro foi corrigido. Certifique-se de que está a usar a versão mais recente do código.

### Problema 7: Campo "Utente" vazio na agenda
**Solução:** Este erro foi corrigido. Certifique-se de que fez o `pnpm build` após extrair o código.

---

## 📞 Precisa de Ajuda?

Se tiver problemas:

1. **Tire um print da tela** do erro
2. **Copie a mensagem de erro** completa
3. **Anote em que passo está**
4. Entre em contacto com suporte

---

## 🔒 Segurança

### Dados Mock (Temporários)
O sistema está configurado para usar dados temporários (mock). Isto significa:
- ✅ Funciona sem base de dados
- ✅ Perfeito para testes
- ❌ Dados não persistem após reiniciar o sistema

### Para Usar em Produção (Dados Reais)
Você vai precisar:
1. Instalar MySQL
2. Configurar a base de dados
3. Editar o ficheiro `.env`
4. Descomentar a linha `DATABASE_URL`

**Isto requer conhecimentos técnicos. Contacte um programador.**

---

## 📊 O Que Esperar Após Instalação

### Módulos Funcionais:
- ✅ Dashboard principal
- ✅ Gestão de Utentes (visualizar fichas)
- ✅ Agenda de Consultas (visualizar, editar)
- ✅ Estatísticas

### Módulos em Desenvolvimento:
- ⏳ Criar novos utentes
- ⏳ Criar novas consultas
- ⏳ Tratamentos (Odontograma)
- ⏳ Orçamentos
- ⏳ Faturação

---

## 🎯 Dados de Teste Disponíveis

### Utentes (5):
1. Maria Silva Santos
2. João Pedro Costa
3. Ana Rita Ferreira
4. Carlos Manuel Oliveira
5. Sofia Marques Rodrigues

### Consultas (4 hoje):
1. 09:00 - Maria Silva Santos - Consulta de Rotina
2. 10:30 - João Pedro Costa - Restauração
3. 14:00 - Ana Rita Ferreira - Implante
4. 16:00 - Carlos Manuel Oliveira - Consulta de Rotina

---

## ✅ Checklist Final

Antes de considerar a instalação completa, verifique:

- [ ] Node.js instalado (`node --version` funciona)
- [ ] pnpm instalado (`pnpm --version` funciona)
- [ ] Código extraído na pasta correta
- [ ] `pnpm install` executado sem erros
- [ ] `pnpm build` executado sem erros
- [ ] PM2 instalado (`pm2 --version` funciona)
- [ ] Sistema iniciado (`pm2 status` mostra "online")
- [ ] Navegador abre http://localhost:3001
- [ ] Dashboard aparece no navegador
- [ ] Consegue ver lista de utentes
- [ ] Consegue ver agenda de consultas

**Se todos os itens estiverem marcados, a instalação está completa! 🎉**

---

**Versão do Guia:** 1.0  
**Data:** 17 de outubro de 2025  
**Sistema:** DentCare PRO v8.0  
**Autor:** Manus AI

