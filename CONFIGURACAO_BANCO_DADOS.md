# 🗄️ Configuração do Banco de Dados

## 📋 Status Atual

✅ **MySQL instalado** (versão 8.0.40)  
✅ **MySQL rodando** na porta 3306  
✅ **Arquivo .env criado** com configurações básicas  
❌ **Senha do root não configurada** (problema de acesso)

## 🚀 Soluções Recomendadas

### 🥇 OPÇÃO 1: XAMPP (MAIS SIMPLES)

**Por que recomendo:** XAMPP é mais fácil de configurar e usar.

1. **Baixar XAMPP**
   - URL: <https://www.apachefriends.org/download.html>
   - Baixar a versão para Windows

2. **Instalar XAMPP**
   - Executar o instalador
   - Aceitar todas as configurações padrão
   - Instalar em `C:\xampp\`

3. **Configurar MySQL**
   - Abrir XAMPP Control Panel
   - Clicar "Start" no MySQL
   - Aguardar ficar verde (Status: Running)
   - Clicar "Admin" para abrir phpMyAdmin

4. **Criar Banco de Dados**
   - No phpMyAdmin: usuário `root`, senha vazia
   - Clicar "New" → nome: `sistema_pagamentos_imobiliarios`
   - Selecionar o banco criado
   - Ir na aba "SQL"
   - Copiar e colar todo o conteúdo do arquivo `database-setup.sql`
   - Clicar "Go" para executar

5. **Atualizar .env**

   ```env
   DATABASE_URL="mysql://root:@localhost:3306/sistema_pagamentos_imobiliarios"
   PORT=3000
   NODE_ENV=development
   ```

### 🥈 OPÇÃO 2: MySQL Workbench

1. **Baixar MySQL Workbench**
   - URL: <https://dev.mysql.com/downloads/workbench/>
   - Instalar normalmente

2. **Criar Conexão**
   - Abrir MySQL Workbench
   - Clicar "MySQL Connections" → "+"
   - Connection Name: "Local MySQL"
   - Hostname: localhost, Port: 3306, Username: root
   - Testar conexão (tentar senhas: vazia, root, 123456, password)

3. **Criar Banco**
   - Abrir a conexão criada
   - Clicar direito em "Schemas" → "Create Schema"
   - Nome: `sistema_pagamentos_imobiliarios`
   - Selecionar o banco → aba "SQL Editor"
   - Copiar e colar conteúdo do `database-setup.sql`
   - Clicar botão "Execute" (raio)

### 🥉 OPÇÃO 3: Resetar Senha MySQL (Avançado)

**Atenção:** Requer privilégios de administrador e conhecimento técnico.

1. **Abrir PowerShell como Administrador**
2. **Parar MySQL:** `net stop mysql80`
3. **Seguir procedimento oficial do MySQL** para resetar senha
4. **Reiniciar MySQL:** `net start mysql80`

**Recomendação:** Use XAMPP (Opção 1) que é mais simples e não requer configuração de senha.

## ✅ Após Configurar

1. **Testar conexão:**

   ```bash
   # Testar se o servidor inicia corretamente
   pnpm start
   ```

2. **Gerar cliente Prisma:**

   ```bash
   npx prisma generate
   ```

3. **Iniciar servidor:**

   ```bash
   pnpm start
   ```

4. **Testar API:**
   - Health check: <http://localhost:3000/health>
   - Dados completos: <http://localhost:3000/api/pagamentos>
   - Relatórios: <http://localhost:3000/api/relatorios/pagamentos-por-imovel>

## 🎯 Próximos Passos

1. Escolha uma das opções acima
2. Configure o banco de dados
3. Execute os testes
4. Inicie o servidor
5. Teste as rotas da API

## 📞 Precisa de Ajuda?

Se encontrar problemas:

- **XAMPP:** Verificar se o MySQL está rodando no Control Panel
- **Workbench:** Verificar se a conexão está funcionando
- **Reset:** Executar como administrador

**Recomendação:** Use o XAMPP - é mais simples e confiável!
