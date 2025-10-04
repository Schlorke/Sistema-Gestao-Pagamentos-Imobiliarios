# Sistema de Gestão de Pagamentos Imobiliários

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

Este sistema foi desenvolvido para apoiar o projeto de extensão NAM (Núcleo de Apoio ao Migrante) da UNIVALI, facilitando a tomada de decisões sobre moradia e trabalho para migrantes através do processamento de dados imobiliários de Santa Catarina.

## 🎯 Objetivos da Parte 2

Implementar 3 serviços REST que processam dados imobiliários usando **programação funcional** (map/filter/reduce/forEach) em memória, sem usar WHERE ou GROUP BY no SQL.

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

- Node.js (versão 18+)
- MySQL Server
- npm ou yarn

### Passos para Instalação

1. **Clone o repositório**

   ```bash
   git clone <url-do-repositorio>
   cd sistema-gestao-pagamentos
   ```

2. **Instale as dependências**

   ```bash
   npm install
   ```

3. **Configure o banco de dados**
   - Execute o script `database-setup.sql` no MySQL
   - Configure a string de conexão no arquivo `.env`

4. **Configure as variáveis de ambiente**

   ```bash
   # Copie o arquivo de exemplo
   cp .env.example .env

   # Edite o arquivo .env com suas configurações
   DATABASE_URL="mysql://usuario:senha@localhost:3306/sistema_pagamentos_imobiliarios"
   PORT=3000
   ```

5. **Gere o cliente Prisma**

   ```bash
   npx prisma generate
   ```

6. **Inicie o servidor**

   ```bash
   npm start
   # ou para desenvolvimento
   npm run dev
   ```

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
  "1": 25000,
  "2": 32000,
  "3": 18000,
  "4": 45000,
  "5": 22000,
  "6": 15000,
  "7": 38000,
  "8": 28000
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
  "03/2023": 14200,
  "04/2023": 15700,
  "05/2023": 19700,
  "06/2023": 15700,
  "07/2023": 16800
}
```

#### 4. Percentual por Tipo

```http
GET http://localhost:3000/api/relatorios/percentual-por-tipo
```

**Resposta:**

```json
{
  "Apartamento": "35.7%",
  "Casa": "28.6%",
  "Sala Comercial": "14.3%",
  "Terreno": "7.1%",
  "Galpão": "7.1%",
  "Loja": "7.1%"
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

## 🧪 Testando os Endpoints

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
