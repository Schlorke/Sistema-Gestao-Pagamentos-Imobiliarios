# Instruções de Execução - Parte 2

## Sistema de Gestão de Pagamentos Imobiliários

### 🚀 Como Executar o Projeto

---

## 📋 Pré-requisitos

### Software Necessário

- **Node.js** (versão 18 ou superior)
- **MySQL Server** (versão 8.0 ou superior)
- **npm** ou **yarn** (gerenciador de pacotes)

### Verificação dos Pré-requisitos

```bash
# Verificar versão do Node.js
node --version

# Verificar versão do npm
npm --version

# Verificar se MySQL está rodando
mysql --version
```

---

## 🛠️ Configuração Inicial

### 1. Instalar Dependências

```bash
# No diretório do projeto
# Com npm
npm install

# Com pnpm (recomendado)
pnpm install
```

### 2. Configurar Banco de Dados

#### Opção A: Usar Script SQL (Recomendado)

```bash
# Conectar ao MySQL como root
mysql -u root -p

# Executar o script de configuração
source database-setup.sql
```

#### Opção B: Configuração Manual

```sql
-- 1. Criar banco de dados
CREATE DATABASE sistema_pagamentos_imobiliarios;
USE sistema_pagamentos_imobiliarios;

-- 2. Executar comandos CREATE TABLE do arquivo database-setup.sql
-- 3. Executar comandos INSERT do arquivo database-setup.sql
```

### 3. Configurar Variáveis de Ambiente

```bash
# Criar arquivo .env na raiz do projeto
touch .env

# Editar o arquivo .env com suas configurações
DATABASE_URL="mysql://usuario:senha@localhost:3306/sistema_pagamentos_imobiliarios"
PORT=3000
NODE_ENV=development
```

**Exemplo de configuração:**

```env
DATABASE_URL="mysql://root:@localhost:3306/sistema_pagamentos_imobiliarios"
PORT=3000
NODE_ENV=development
```

**⚠️ IMPORTANTE:** O XAMPP usa senha vazia por padrão. Use `mysql://root:@localhost:3306/...` (sem senha).

### 4. Comandos do Prisma

#### 4.1. Gerar Cliente Prisma

```bash
npx prisma generate
```

**⚠️ IMPORTANTE:** Se houver erro de permissão (EPERM), pare o servidor primeiro:

```bash
# Parar todos os processos Node.js
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force

# Gerar cliente Prisma
npx prisma generate

# Reiniciar servidor
pnpm start
```

#### 4.2. Visualizar Estrutura do Banco

```bash
# Introspectar banco e atualizar schema
npx prisma db pull

# Gerar cliente após introspectar
npx prisma generate
```

#### 4.3. Abrir Prisma Studio (Interface Visual)

```bash
# Abrir interface web para visualizar dados
npx prisma studio --port 5555
```

Depois acesse: `http://localhost:5555`

#### 4.4. Executar Migrações (se necessário)

```bash
# Aplicar migrações pendentes
npx prisma db push

# Executar script SQL específico
npx prisma db execute --file database-setup.sql
```

#### 4.5. Verificar Status do Banco

```bash
# Verificar conexão com banco
npx prisma db pull --preview-feature

# Validar schema
npx prisma validate
```

#### 4.6. Comandos Úteis para Desenvolvimento

```bash
# Reset completo do banco (CUIDADO!)
npx prisma db push --force-reset

# Formatar schema
npx prisma format

# Gerar diagrama ER (se disponível)
npx prisma generate --schema=./prisma/schema.prisma
```

---

## 🏃‍♂️ Executando o Servidor

### Iniciar o Servidor

```bash
# Modo produção
npm start
# ou
pnpm start

# Modo desenvolvimento (com auto-reload)
npm run dev
# ou
pnpm dev
```

### Verificar se o Servidor Está Rodando

```bash
# Testar health check
curl http://localhost:3000/health

# Ou abrir no navegador
# http://localhost:3000/health
```

**Resposta esperada:**

```json
{
  "status": "OK",
  "mensagem": "Sistema operacional",
  "banco_de_dados": "Conectado",
  "timestamp": "2025-01-XX..."
}
```

---

## 🧪 Testando as Rotas da Parte 2

### 1. Teste Automatizado (Recomendado)

```bash
# Executar script de teste
node test-endpoints.js
```

**Saída esperada:**

```text
🚀 Iniciando testes dos endpoints da Parte 2
✅ Servidor está rodando e respondendo
🔍 Testando: Pagamentos por Imóvel
✅ PASSOU - Formato válido
📊 Dados retornados para "Pagamentos por Imóvel":
  1: 25000
  2: 32000
  3: 18000
  ...
🎉 TODOS OS TESTES PASSARAM!
```

### 2. Teste Manual com cURL

#### Testar Pagamentos por Imóvel

```bash
curl http://localhost:3000/api/relatorios/pagamentos-por-imovel
```

**Resposta esperada:**

```json
{
  "1": 17500,
  "2": 22400,
  "3": 12600,
  "4": 27000,
  "5": 8800,
  "6": 4500,
  "7": 3800,
  "8": 2800
}
```

#### Testar Vendas por Mês

```bash
curl http://localhost:3000/api/relatorios/vendas-por-mes
```

**Resposta esperada:**

```json
{
  "01/2023": 7500,
  "02/2023": 12000,
  "03/2023": 16700,
  "04/2023": 15700,
  "05/2023": 17000,
  "06/2023": 15700,
  "07/2023": 14800
}
```

#### Testar Percentual por Tipo

```bash
curl http://localhost:3000/api/relatorios/percentual-por-tipo
```

**Resposta esperada:**

```json
{
  "Apartamento": "38.9%",
  "Casa": "36.1%",
  "Sala Comercial": "11.1%",
  "Terreno": "8.3%",
  "Galpão": "2.8%",
  "Loja": "2.8%"
}
```

### 3. Teste no Navegador

Abra os seguintes URLs no navegador:

- `http://localhost:3000/api/relatorios/pagamentos-por-imovel`
- `http://localhost:3000/api/relatorios/vendas-por-mes`
- `http://localhost:3000/api/relatorios/percentual-por-tipo`

---

## 🔍 Verificação de Dados

### Verificar Dados no Banco

```sql
-- Conectar ao banco
mysql -u root -p sistema_pagamentos_imobiliarios

-- Verificar total de registros
SELECT 'Tipos de Imóveis' as tabela, COUNT(*) as total FROM tipos_imovel
UNION ALL
SELECT 'Imóveis' as tabela, COUNT(*) as total FROM imoveis
UNION ALL
SELECT 'Pagamentos' as tabela, COUNT(*) as total FROM pagamentos;

-- Verificar se todos os imóveis têm pagamentos
SELECT
    i.codigo,
    i.descricao,
    COUNT(p.id) as total_pagamentos
FROM imoveis i
LEFT JOIN pagamentos p ON i.id = p.imovelId
GROUP BY i.id, i.codigo, i.descricao
ORDER BY i.codigo;
```

### Verificar Rota Original (Parte 1)

```bash
curl http://localhost:3000/api/pagamentos
```

---

## 📊 Endpoints Disponíveis

### Rotas da Parte 1 (Mantidas)

- `GET /` - Página inicial
- `GET /api/pagamentos` - Todos os pagamentos com JOIN
- `GET /api/info` - Informações do sistema
- `GET /health` - Status do sistema

### Rotas da Parte 2 (Novas)

- `GET /api/relatorios/pagamentos-por-imovel` - Soma por imóvel
- `GET /api/relatorios/vendas-por-mes` - Total por mês/ano
- `GET /api/relatorios/percentual-por-tipo` - Percentual por tipo

---

## 🐛 Solução de Problemas

### Erro de Conexão com Banco

```text
❌ Erro ao conectar ao banco de dados
```

**Soluções:**

1. **Verificar se MySQL está rodando** no XAMPP Control Panel
2. **Verificar credenciais no arquivo `.env`** (XAMPP usa senha vazia)
3. **Verificar se o banco existe:** `sistema_pagamentos_imobiliarios`
4. **Executar o script `database-setup.sql`** via phpMyAdmin
5. **Verificar se as tabelas foram criadas** corretamente

### Erro de Porta em Uso

```text
Error: listen EADDRINUSE: address already in use :::3000
```

**Soluções:**

1. Parar processo na porta 3000: `lsof -ti:3000 | xargs kill`
2. Mudar porta no arquivo `.env`: `PORT=3001`

### Erro de Dependências

```text
Module not found: Error: Can't resolve '@prisma/client'
```

**Solução:**

```bash
npm install
npx prisma generate
```

### Dados Não Aparecem

**Verificar:**

1. Se o banco tem dados: executar consultas SQL de verificação
2. Se as tabelas existem: `SHOW TABLES;`
3. Se os relacionamentos estão corretos

### Erro de Relacionamento Prisma

```text
Unknown field `tipo_imovel` for include statement on model `Imovel`
```

**Solução:**

Este erro foi corrigido no código. O relacionamento correto é `tipoImovel`, não `tipo_imovel`. Se encontrar este erro:

1. **Parar o servidor**
2. **Regenerar cliente Prisma:** `npx prisma generate`
3. **Reiniciar servidor**

---

## 📝 Logs e Monitoramento

### Logs do Servidor

O servidor exibe logs detalhados:

```text
🚀 Iniciando servidor...
✅ Conexão com banco de dados estabelecida!
✅ Servidor rodando na porta 3000
📊 ENDPOINTS DISPONÍVEIS:
📍 Dados completos: http://localhost:3000/api/pagamentos
💰 Pagamentos por imóvel: http://localhost:3000/api/relatorios/pagamentos-por-imovel
📅 Vendas por mês: http://localhost:3000/api/relatorios/vendas-por-mes
🥧 Percentual por tipo: http://localhost:3000/api/relatorios/percentual-por-tipo
```

### Logs das Requisições

```text
📊 Recebida requisição GET /api/relatorios/pagamentos-por-imovel
✅ Consulta executada com sucesso. 35 registros encontrados.
📈 Processamento concluído. 8 imóveis processados.
```

---

## 🎥 Para Demonstração

### Checklist para o Vídeo

- [ ] Servidor rodando (`npm start`)
- [ ] Banco de dados configurado
- [ ] Testar rota 1: `/api/relatorios/pagamentos-por-imovel`
- [ ] Testar rota 2: `/api/relatorios/vendas-por-mes`
- [ ] Testar rota 3: `/api/relatorios/percentual-por-tipo`
- [ ] Mostrar código fonte das 3 rotas
- [ ] Mostrar estrutura do banco de dados
- [ ] Explicar uso do `reduce()` em cada rota

### Pontos Importantes para Mencionar

1. **Programação funcional:** Uso de `reduce()` e `forEach()`
2. **Processamento em memória:** Sem WHERE/GROUP BY no SQL
3. **Formato JSON:** Exatamente como solicitado
4. **Reutilização:** Função `buscarTodosOsDados()` compartilhada
5. **Tratamento de erros:** Padronizado em todas as rotas

---

## ✅ Validação Final

### Teste Completo

```bash
# 1. Iniciar servidor
pnpm start

# 2. Executar testes automatizados
node test-endpoints.js

# 3. Verificar se todos os testes passaram
# Deve mostrar: "🎉 TODOS OS TESTES PASSARAM!"

# 4. Testar manualmente cada endpoint
curl http://localhost:3000/api/relatorios/pagamentos-por-imovel
curl http://localhost:3000/api/relatorios/vendas-por-mes
curl http://localhost:3000/api/relatorios/percentual-por-tipo
```

### Critérios de Sucesso

- [ ] Servidor inicia sem erros
- [ ] Todas as 3 rotas retornam JSON válido
- [ ] Formatos estão exatamente como especificado
- [ ] Dados são processados em memória (sem SQL WHERE/GROUP BY)
- [ ] Uso correto de programação funcional (reduce/forEach)

---

## Projeto pronto para entrega! 🎉

**Desenvolvido para:** Hands on Work VII - UNIVALI  
**Equipe:** Harry, Antonio, Guilherme, Juliano  
**Data:** Janeiro 2025
