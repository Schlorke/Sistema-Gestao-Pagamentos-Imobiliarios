# Sistema de Gestão de Pagamentos Imobiliários

<p align="center">
<img src="assets/logo_univali.png" alt="UNIVALI Logo" width="300">
</p>

<p align="center">

## Universidade do Vale do Itajaí - UNIVALI

Instituição de Ensino Superior - Itajaí/SC

</p>

---

<p align="center">

> **Logo da UNIVALI** - Logo oficial salva localmente em `assets/logo_univali.png`

</p>

## Hands on Work VII - Parte 2

**Projeto:** NAM – Núcleo de Apoio ao Migrante  
**Disciplina:** Hands on Work VII  
**Curso:** Análise e Desenvolvimento de Sistemas - UNIVALI

### Equipe

- Harry Ciciliani Schlorke (<harry.8314900@edu.univali.br>)
- Antonio Junior dos Santos (<antonio.8406685@edu.univali.br>)
- Guilherme Amaral Cardoso (<gui.a.cardoso@edu.univali.br>)
- Juliano Boaventura Fialho (<juliano.8333009@edu.univali.br>)

### Professor

Rafael Queiroz Gonçalves

---

## 📋 Descrição do Projeto

Este sistema foi desenvolvido para apoiar o projeto de extensão NAM (Núcleo de Apoio ao Migrante) da UNIVALI,
facilitando a tomada de decisões sobre moradia e trabalho para migrantes através do processamento de dados
imobiliários de Santa Catarina.

## 🎯 Objetivos da Parte 2

Implementar 3 serviços REST que processam dados imobiliários usando **programação funcional**
(map/filter/reduce/forEach) em memória, sem usar WHERE ou GROUP BY no SQL.

### Endpoints Implementados

1. **`GET /api/relatorios/pagamentos-por-imovel`**
   - Retorna soma de pagamentos por imóvel
   - Formato: `{"1": 25000, "2": 32000, "3": 18000}`

2. **`GET /api/relatorios/vendas-por-mes`**
   - Retorna total de vendas por mês/ano
   - Formato: `{"01/2023": 7500, "02/2023": 12000, "03/2023": 14200}`

3. **`GET /api/relatorios/percentual-por-tipo`**
   - Retorna percentual de vendas por tipo de imóvel
   - Formato: `{"Apartamento": "50.0%", "Casa": "30.0%", "Sala Comercial": "20.0%"}`

## 🛠️ Tecnologias Utilizadas

- **Backend:** Node.js + Express.js
- **Banco de Dados:** MySQL
- **ORM:** Prisma
- **Paradigma:** Programação Funcional (JavaScript ES6+)

## 📦 Instalação e Configuração

### Pré-requisitos

- **Node.js** (versão 18+)
- **XAMPP** (recomendado) ou MySQL Server
- **npm** ou yarn

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone https://github.com/Schlorke/Sistema-Gestao-Pagamentos-Imobiliarios.git
   cd Sistema-Gestao-Pagamentos-Imobiliarios
   ```

2. **Instale as dependências**

   ```bash
   # Com npm
   npm install

   # Com pnpm (recomendado)
   pnpm install
   ```

3. **Configure o XAMPP/MySQL**
   - Instale o [XAMPP](https://www.apachefriends.org/download.html)
   - Abra o XAMPP Control Panel
   - Clique "Start" no MySQL
   - Clique "Admin" para abrir phpMyAdmin

4. **Configure o banco de dados**
   - No phpMyAdmin, crie um banco chamado `sistema_pagamentos_imobiliarios`
   - Execute o script `database-setup.sql` no banco criado

5. **Configure as variáveis de ambiente**

   ```bash
   # Crie o arquivo .env na raiz do projeto
   DATABASE_URL="mysql://root:@localhost:3306/sistema_pagamentos_imobiliarios"
   PORT=3000
   NODE_ENV=development
   ```

   **⚠️ IMPORTANTE:** O XAMPP usa senha vazia por padrão. Use `root:@localhost` (sem senha).

6. **Gere o cliente Prisma**

   ```bash
   npx prisma generate
   ```

7. **Inicie o servidor**

   ```bash
   # Opção 1: Comando direto
   node server.js

   # Opção 2: Via npm/pnpm
   npm start
   # ou
   pnpm start

   # Opção 3: Modo desenvolvimento (com auto-reload)
   npm run dev
   # ou
   pnpm dev
   ```

### Teste Automatizado

Após configurar tudo, execute o script de teste:

```bash
# Com o servidor rodando em outro terminal
node test-endpoints.js
```

Este script testa automaticamente todos os 3 endpoints da Parte 2.

## 🚀 Como Usar

### Endpoints Disponíveis

#### 1. Dados Completos

```http
GET http://localhost:3000/api/pagamentos
```

Retorna todos os pagamentos com informações completas dos imóveis.

#### 2. Pagamentos por Imóvel

```http
GET http://localhost:3000/api/relatorios/pagamentos-por-imovel
```

**Resposta:**

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

#### 3. Vendas por Mês

```http
GET http://localhost:3000/api/relatorios/vendas-por-mes
```

**Resposta:**

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

#### 4. Percentual por Tipo

```http
GET http://localhost:3000/api/relatorios/percentual-por-tipo
```

**Resposta:**

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

#### 5. Informações do Sistema

```http
GET http://localhost:3000/api/info
```

#### 6. Health Check

```http
GET http://localhost:3000/health
```

## 📊 Estrutura do Banco de Dados

### Tabelas

1. **`tipos_imovel`** - Tipos de imóveis (Apartamento, Casa, etc.)
2. **`imoveis`** - Cadastro de imóveis
3. **`pagamentos`** - Registro de pagamentos

### Relacionamentos

- Um tipo de imóvel pode ter vários imóveis
- Um imóvel pode ter vários pagamentos
- Cada pagamento pertence a um imóvel

## 🔧 Programação Funcional

O sistema utiliza técnicas de programação funcional para processar os dados em memória:

### Exemplo - Pagamentos por Imóvel

```javascript
const pagamentosPorImovel = pagamentos.reduce((acc, pagamento) => {
  const imovelId = pagamento.imovel.id.toString();
  if (!acc[imovelId]) {
    acc[imovelId] = 0;
  }
  acc[imovelId] += parseFloat(pagamento.valor);
  return acc;
}, {});
```

### Exemplo - Percentual por Tipo

```javascript
// 1. Contar por tipo usando reduce()
const contagemPorTipo = pagamentos.reduce((acc, pagamento) => {
  const tipoImovel = pagamento.imovel.tipo_imovel.nome;
  acc[tipoImovel] = (acc[tipoImovel] || 0) + 1;
  return acc;
}, {});

// 2. Calcular percentuais usando forEach()
const percentualPorTipo = {};
Object.entries(contagemPorTipo).forEach(([tipo, quantidade]) => {
  const percentual = (quantidade / totalVendas) * 100;
  percentualPorTipo[tipo] = `${percentual.toFixed(1)}%`;
});
```

## 📈 Características Técnicas

- **Sem filtros SQL:** Todos os dados são carregados na memória
- **Processamento em JavaScript:** Usando reduce(), map(), filter(), forEach()
- **Respostas JSON:** Formato limpo e estruturado
- **Tratamento de erros:** Logs detalhados e respostas padronizadas
- **Validação de dados:** Verificação de integridade dos dados

## 🔧 Solução de Problemas

### Erro de Conexão com Banco

Se aparecer erro de conexão:

1. **Verifique se o XAMPP MySQL está rodando**

   ```bash
   # No XAMPP Control Panel, clique "Start" no MySQL
   ```

2. **Verifique se o banco existe**
   - Abra phpMyAdmin (<http://localhost/phpmyadmin>)
   - Confirme que existe o banco `sistema_pagamentos_imobiliarios`

3. **Verifique o arquivo .env**

   ```bash
   # Deve estar assim para XAMPP:
   DATABASE_URL="mysql://root:@localhost:3306/sistema_pagamentos_imobiliarios"
   ```

### Erro "Cannot find module"

Se aparecer erro ao executar `node server.js`:

1. **Navegue para o diretório correto**

   ```bash
   cd Sistema-Gestao-Pagamentos-Imobiliarios
   ```

2. **Verifique se as dependências estão instaladas**

   ```bash
   npm install
   ```

### Erro de Permissão Prisma

Se aparecer erro ao executar `npx prisma generate`:

1. **Pare o servidor** (Ctrl+C)
2. **Execute o comando novamente**

   ```bash
   npx prisma generate
   ```

3. **Inicie o servidor**

   ```bash
   node server.js
   ```

### Erro de Porta em Uso (EADDRINUSE)

Se aparecer erro `Error: listen EADDRINUSE: address already in use 0.0.0.0:3000`:

1. **Parar todos os processos Node.js:**

   ```bash
   # Windows PowerShell
   taskkill /IM node.exe /F

   # Linux/Mac
   pkill node
   ```

2. **Verificar se a porta está livre:**

   ```bash
   # Windows
   netstat -ano | findstr :3000

   # Linux/Mac
   lsof -i :3000
   ```

3. **Reiniciar o servidor:**

   ```bash
   pnpm start
   ```

### Problema com Comandos pnpm/npm

Se `pnpm` não estiver disponível, use `npm`:

```bash
# Em vez de pnpm start
npm start

# Em vez de pnpm install
npm install

# Em vez de pnpm dev
npm run dev
```

## 🧪 Testando os Endpoints

### Teste Automatizado (Recomendado)

```bash
node test-endpoints.js
```

### Usando cURL

```bash
# Testar pagamentos por imóvel
curl http://localhost:3000/api/relatorios/pagamentos-por-imovel

# Testar vendas por mês
curl http://localhost:3000/api/relatorios/vendas-por-mes

# Testar percentual por tipo
curl http://localhost:3000/api/relatorios/percentual-por-tipo
```

### Usando Postman ou Insomnia

Importe as URLs acima e teste os endpoints GET.

## 📝 Logs e Monitoramento

O sistema inclui logs detalhados para monitoramento:

- ✅ Consultas executadas com sucesso
- 📊 Estatísticas processadas
- ⚠️ Avisos de validação
- ❌ Erros com detalhes

## 🎥 Demonstração

Para a entrega do projeto, foi criado um vídeo demonstrando:

1. Estrutura do banco de dados
2. Código fonte das 3 rotas
3. Testes das requisições REST
4. Resultados JSON de cada endpoint

## 📚 Referências

- [Express.js Documentation](https://expressjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [JavaScript Functional Programming](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)

---

**Desenvolvido para o projeto NAM - Núcleo de Apoio ao Migrante da UNIVALI**  
**2025 - Itajaí, Santa Catarina**
