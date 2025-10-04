# 🛠️ Comandos do Prisma - Guia Completo

## Sistema de Gestão de Pagamentos Imobiliários

### 📋 Comandos Essenciais

#### 1. Visualizar Estrutura do Banco

```bash
# Introspectar banco e atualizar schema.prisma
npx prisma db pull

# Gerar cliente após introspectar
npx prisma generate
```

**Resultado:** Atualiza o arquivo `prisma/schema.prisma` com a estrutura atual do banco.

#### 2. Abrir Interface Visual

```bash
# Abrir Prisma Studio na porta 5555
npx prisma studio --port 5555
```

**Acesse:** `http://localhost:5555`

**Funcionalidades:**

- ✅ Visualizar dados das tabelas
- ✅ Editar registros
- ✅ Adicionar/remover dados
- ✅ Ver relacionamentos

#### 3. Gerar Cliente

```bash
# Gerar cliente Prisma
npx prisma generate
```

**Quando usar:**

- Após mudanças no `schema.prisma`
- Antes de executar o servidor
- Após `npx prisma db pull`

---

### 🔧 Comandos de Desenvolvimento

#### Executar Scripts SQL

```bash
# Executar arquivo SQL específico
npx prisma db execute --file database-setup.sql

# Executar comando SQL direto
npx prisma db execute --stdin
```

#### Aplicar Mudanças no Banco

```bash
# Aplicar mudanças do schema para o banco
npx prisma db push

# Forçar reset completo (CUIDADO!)
npx prisma db push --force-reset
```

#### Validar e Formatar

```bash
# Validar sintaxe do schema
npx prisma validate

# Formatar arquivo schema.prisma
npx prisma format
```

---

### 🗂️ Estrutura das Tabelas

#### Tabela `tipos_imovel`

```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- nome (VARCHAR(100))
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### Tabela `imoveis`

```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- codigo (VARCHAR(50), UNIQUE)
- descricao (VARCHAR(255))
- tipoImovelId (INT, FOREIGN KEY)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

#### Tabela `pagamentos`

```sql
- id (INT, AUTO_INCREMENT, PRIMARY KEY)
- dataPagamento (DATE)
- valor (DECIMAL(10,2))
- imovelId (INT, FOREIGN KEY)
- createdAt (TIMESTAMP)
- updatedAt (TIMESTAMP)
```

---

### 🚀 Fluxo de Trabalho Recomendado

#### 1. Primeira Execução

```bash
# 1. Introspectar banco
npx prisma db pull

# 2. Gerar cliente
npx prisma generate

# 3. Abrir interface visual
npx prisma studio --port 5555
```

#### 2. Desenvolvimento Diário

```bash
# 1. Gerar cliente (se necessário)
npx prisma generate

# 2. Executar servidor
node server.js

# 3. Testar endpoints
node test-endpoints.js
```

#### 3. Verificação de Dados

```bash
# 1. Abrir Prisma Studio
npx prisma studio --port 5555

# 2. Navegar para: http://localhost:5555
# 3. Visualizar dados das 3 tabelas
```

---

### 🐛 Solução de Problemas

#### Erro de Permissão (EPERM)

```bash
# Parar todos os processos Node.js
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Gerar cliente
npx prisma generate
```

#### Erro de Conexão

```bash
# Verificar se MySQL está rodando (XAMPP)
# Verificar arquivo .env
DATABASE_URL="mysql://root:@localhost:3306/sistema_pagamentos_imobiliarios"
```

#### Schema Não Encontrado

```bash
# Verificar se está no diretório correto
cd "C:\Users\harry\OneDrive\Área de Trabalho\Nova pasta"

# Executar comando
npx prisma db pull
```

---

### 📊 Comandos Úteis para Análise

#### Verificar Status do Banco

```bash
# Testar conexão
npx prisma db pull

# Validar schema
npx prisma validate
```

#### Backup e Restore

```bash
# Exportar dados (via phpMyAdmin)
# Importar dados (via phpMyAdmin)
# Ou usar mysqldump
```

#### Limpeza e Reset

```bash
# CUIDADO: Reset completo do banco
npx prisma db push --force-reset

# Executar script de setup
npx prisma db execute --file database-setup.sql
```

---

### 🎯 Comandos Específicos do Projeto

#### Para Visualizar Dados das 3 Tabelas

```bash
# 1. Abrir Prisma Studio
npx prisma studio --port 5555

# 2. Acessar http://localhost:5555
# 3. Navegar pelas tabelas:
#    - tipos_imovel
#    - imoveis
#    - pagamentos
```

#### Para Verificar Relacionamentos

```bash
# 1. Introspectar banco
npx prisma db pull

# 2. Verificar schema.prisma
# 3. Confirmar foreign keys
```

#### Para Testar Endpoints

```bash
# 1. Executar servidor
node server.js

# 2. Testar automaticamente
node test-endpoints.js

# 3. Testar manualmente
curl http://localhost:3000/api/relatorios/pagamentos-por-imovel
```

---

**📝 Nota:** Todos os comandos devem ser executados no diretório raiz do projeto onde está localizado o arquivo `prisma/schema.prisma`.
