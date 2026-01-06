# 🦷 DentCare PRO v8 - Manual do Utilizador (Windows)

Este pacote contém a versão completa e profissional do **DentCare PRO v8**, configurada especificamente para o seu computador Windows com base de dados real (SQLite).

## 🚀 Como Iniciar o Programa

Para sua conveniência, criei um ficheiro de arranque automático. Basta seguir estes passos:

1.  **Extrair o ZIP**: Extraia todo o conteúdo deste ficheiro para a pasta `C:\Users\ferpe\Downloads\dentcare`.
2.  **Iniciar**: Dê dois cliques no ficheiro `INICIAR_DENTCARE.bat`.
3.  **Aceder**: Abra o seu navegador (Chrome ou Edge) e escreva: `http://localhost:3000`

---

## ✨ Funcionalidades Ativadas nesta Versão

*   **💾 Base de Dados Real (SQLite)**: Todos os seus dados são gravados no ficheiro `sqlite.db`. Pode fechar o programa e reiniciar o PC que os dados estarão lá.
*   **📅 Agenda Inteligente**: Agora pode criar um **Novo Utente** diretamente na janela de marcação de consulta, sem sair da agenda.
*   **📝 Registo Simplificado**: Apenas o **Nome** e o **Telemóvel** são obrigatórios para criar um paciente rapidamente.
*   **💰 Gestão Financeira**: Módulo de Orçamentos e Faturação totalmente funcional.
*   **🧠 Inteligência Artificial**: Preparado para análise de imagens dentárias (requer chave API no ficheiro `.env`).

---

## 🛠️ Resolução de Problemas Comuns

### O programa não liga (Erro de 'pnpm')
Se ao clicar no ficheiro `.bat` vir um erro sobre `pnpm`, abra o PowerShell e escreva:
```powershell
npm install -g pnpm
```

### O erro "NODE_ENV" aparece
Use sempre o ficheiro `INICIAR_DENTCARE.bat` ou o atalho que criámos no Ambiente de Trabalho. Eles corrigem este erro automaticamente para o Windows.

### Limpar a Cache do Navegador
Se fez uma atualização e não vê as mudanças, pressione **CTRL + F5** no seu navegador enquanto estiver na página do programa.

---

## 📁 Estrutura de Ficheiros Importante
*   `sqlite.db`: Onde estão guardados todos os seus pacientes e consultas. **Não apague este ficheiro!**
*   `.env`: Ficheiro de configurações (onde pode colocar as suas chaves de IA no futuro).
*   `data/`: Pasta de cópia de segurança dos dados.

---
**Desenvolvido com ❤️ pelo Manus para a sua Clínica.**
