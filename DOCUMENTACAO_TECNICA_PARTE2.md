# Documentação Técnica - Parte 2

## Sistema de Gestão de Pagamentos Imobiliários

### Hands on Work VII - Implementação das 3 Rotas REST

---

## 📋 Visão Geral

Este documento detalha a implementação da **Parte 2** do projeto, focando nas 3 rotas REST que utilizam **programação funcional** para processar dados imobiliários em memória, seguindo os requisitos específicos da disciplina.

## 🎯 Objetivos Alcançados

✅ **Implementar 3 rotas REST/GET que retornam JSON**  
✅ **Usar programação funcional (reduce, map, filter, forEach)**  
✅ **Processar dados em memória (sem WHERE/GROUP BY no SQL)**  
✅ **Retornar formatos específicos conforme solicitado**  
✅ **Manter consistência com código existente**

---

## 🔧 Implementações Detalhadas

### 1. Rota: `/api/relatorios/pagamentos-por-imovel`

#### Objetivo - Pagamentos por Imóvel

Retornar uma lista com o ID de cada imóvel e sua respectiva soma de todos os pagamentos.

#### Formato Esperado - Pagamentos por Imóvel

```json
{
  "1": 25000,
  "2": 32000,
  "3": 18000,
  "4": 45000
}
```

#### Implementação Técnica - Pagamentos por Imóvel

```javascript
app.get('/api/relatorios/pagamentos-por-imovel', async (req, res) => {
  try {
    // 1. Buscar TODOS os dados (sem WHERE ou GROUP BY)
    const pagamentos = await buscarTodosOsDados();

    // 2. Processar em memória usando reduce()
    const pagamentosPorImovel = pagamentos.reduce((acc, pagamento) => {
      const imovelId = pagamento.imovel.id.toString();

      // Inicializar se não existir
      if (!acc[imovelId]) {
        acc[imovelId] = 0;
      }

      // Somar valor ao total do imóvel
      acc[imovelId] += parseFloat(pagamento.valor);

      return acc;
    }, {}); // Objeto vazio como valor inicial

    res.json(pagamentosPorImovel);
  } catch (error) {
    // Tratamento de erro padronizado
  }
});
```

#### Explicação do Reduce() - Pagamentos por Imóvel

- **Accumulator (acc):** Objeto que acumula os totais por imóvel
- **Current Value (pagamento):** Cada pagamento do array
- **Valor Inicial:** `{}` - objeto vazio
- **Lógica:** Agrupa por ID do imóvel e soma os valores

#### Complexidade - Pagamentos por Imóvel

- **Tempo:** O(n) - percorre cada pagamento uma vez
- **Espaço:** O(m) - onde m é o número de imóveis únicos

---

### 2. Rota: `/api/relatorios/vendas-por-mes`

#### Objetivo - Vendas por Mês

Retornar uma lista com cada mês/ano e o total de vendas ocorridas no período.

#### Formato Esperado - Vendas por Mês

```json
{
  "01/2023": 7500,
  "02/2023": 12000,
  "03/2023": 14200,
  "04/2023": 15700
}
```

#### Implementação Técnica - Vendas por Mês

```javascript
app.get('/api/relatorios/vendas-por-mes', async (req, res) => {
  try {
    // 1. Buscar TODOS os dados
    const pagamentos = await buscarTodosOsDados();

    // 2. Processar em memória usando reduce()
    const vendasPorMes = pagamentos.reduce((acc, pagamento) => {
      // Formatar data para MM/YYYY
      const mesAno = formatarMesAno(pagamento.data_pagamento);

      // Inicializar se não existir
      if (!acc[mesAno]) {
        acc[mesAno] = 0;
      }

      // Somar valor ao total do mês/ano
      acc[mesAno] += parseFloat(pagamento.valor);

      return acc;
    }, {}); // Objeto vazio como valor inicial

    res.json(vendasPorMes);
  } catch (error) {
    // Tratamento de erro
  }
});
```

#### Função Auxiliar

```javascript
const formatarMesAno = data => {
  const d = new Date(data);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${mes}/${ano}`;
};
```

#### Explicação do Reduce() - Vendas por Mês

- **Accumulator (acc):** Objeto que acumula totais por mês/ano
- **Current Value (pagamento):** Cada pagamento do array
- **Lógica:** Agrupa por período (MM/YYYY) e soma os valores

---

### 3. Rota: `/api/relatorios/percentual-por-tipo`

#### Objetivo - Percentual por Tipo

Retornar uma lista com cada tipo de imóvel e seu respectivo percentual no total de vendas (quantitativas).

#### Formato Esperado - Percentual por Tipo

```json
{
  "Apartamento": "35.7%",
  "Casa": "28.6%",
  "Sala Comercial": "14.3%",
  "Terreno": "7.1%"
}
```

#### Implementação Técnica - Percentual por Tipo

```javascript
app.get('/api/relatorios/percentual-por-tipo', async (req, res) => {
  try {
    // 1. Buscar TODOS os dados
    const pagamentos = await buscarTodosOsDados();

    // 2. Primeiro: contar por tipo usando reduce()
    const contagemPorTipo = pagamentos.reduce((acc, pagamento) => {
      const tipoImovel = pagamento.imovel.tipo_imovel.nome;

      // Inicializar se não existir
      if (!acc[tipoImovel]) {
        acc[tipoImovel] = 0;
      }

      // Incrementar contador
      acc[tipoImovel] += 1;

      return acc;
    }, {});

    // 3. Calcular total de vendas
    const totalVendas = pagamentos.length;

    // 4. Segundo: calcular percentuais usando forEach()
    const percentualPorTipo = {};
    Object.entries(contagemPorTipo).forEach(([tipo, quantidade]) => {
      // Calcular percentual: (quantidade / total) * 100
      const percentual = (quantidade / totalVendas) * 100;

      // Formatar com 1 casa decimal e símbolo %
      percentualPorTipo[tipo] = `${percentual.toFixed(1)}%`;
    });

    res.json(percentualPorTipo);
  } catch (error) {
    // Tratamento de erro
  }
});
```

#### Explicação do Processamento

1. **Primeiro Reduce():** Conta quantos pagamentos existem para cada tipo
2. **Cálculo do Total:** `pagamentos.length` - total de vendas
3. **forEach():** Calcula percentual para cada tipo
4. **Formatação:** Arredonda para 1 casa decimal e adiciona símbolo %

#### Complexidade - Percentual por Tipo

- **Tempo:** O(n + m) - onde n é pagamentos e m é tipos únicos
- **Espaço:** O(m) - onde m é o número de tipos únicos

---

## 🔄 Função Auxiliar Compartilhada

### `buscarTodosOsDados()`

```javascript
const buscarTodosOsDados = async () => {
  return await prisma.pagamento.findMany({
    include: {
      imovel: {
        include: {
          tipo_imovel: true,
        },
      },
    },
  });
};
```

#### Características

- **Reutilização:** Usada pelas 3 rotas
- **Sem Filtros:** Não usa WHERE ou GROUP BY
- **JOIN Completo:** Inclui dados de imóvel e tipo
- **Eficiência:** Uma única consulta para todos os dados

---

## 📊 Análise de Performance

### Vantagens do Processamento em Memória

1. **Flexibilidade:** Lógica complexa pode ser implementada em JavaScript
2. **Reutilização:** Mesma consulta para múltiplas análises
3. **Manutenibilidade:** Código mais legível e testável
4. **Escalabilidade:** Adequado para máquinas com grande capacidade de processamento

### Considerações

1. **Memória:** Todos os dados carregados na RAM
2. **Rede:** Transferência completa de dados do banco
3. **CPU:** Processamento adicional no servidor

### Otimizações Implementadas

- **Uma consulta:** `buscarTodosOsDados()` reutilizada
- **Parse único:** `parseFloat()` aplicado uma vez por valor
- **Estruturas eficientes:** Uso de objetos para agrupamento

---

## 🧪 Validação e Testes

### Estrutura de Validação

```javascript
// Exemplo para pagamentos-por-imovel
function validarFormato(endpoint, data) {
  const errors = [];

  if (typeof data !== 'object' || Array.isArray(data)) {
    errors.push('Dados devem ser um objeto, não um array');
  }

  for (const [key, value] of Object.entries(data)) {
    if (typeof key !== 'string') {
      errors.push(`Chave deve ser string, encontrado: ${typeof key}`);
    }
    if (typeof value !== 'number') {
      errors.push(`Valor deve ser number, encontrado: ${typeof value}`);
    }
  }

  return errors;
}
```

### Testes Automatizados

- **Formato JSON:** Validação de estrutura
- **Tipos de dados:** Verificação de tipos esperados
- **Valores:** Validação de ranges e formatos
- **Performance:** Tempo de resposta das rotas

---

## 🔍 Padrões de Código Seguidos

### 1. Estrutura Consistente

```javascript
app.get('/api/relatorios/endpoint', async (req, res) => {
    console.log('📊 Recebida requisição GET /api/relatorios/endpoint');

    try {
        // 1. Buscar dados
        const pagamentos = await buscarTodosOsDados();

        // 2. Processar com programação funcional
        const resultado = pagamentos.reduce(/* lógica */, {});

        // 3. Retornar JSON
        res.json(resultado);

    } catch (error) {
        // 4. Tratamento de erro padronizado
        res.status(500).json({
            erro: 'Erro ao processar dados',
            mensagem: error.message
        });
    }
});
```

### 2. Logs Estruturados

- **Início:** Log da requisição recebida
- **Processamento:** Log do número de registros
- **Conclusão:** Log dos resultados processados
- **Erros:** Log detalhado de erros

### 3. Tratamento de Erros

- **Try/Catch:** Em todas as rotas assíncronas
- **Status Codes:** 200 para sucesso, 500 para erro
- **Mensagens:** Padronizadas e informativas

---

## 📈 Métricas de Implementação

### Código Implementado

- **Linhas de código:** ~200 linhas (3 rotas + auxiliares)
- **Funções:** 4 funções principais + auxiliares
- **Comentários:** Documentação inline completa
- **Testes:** Script de validação automatizado

### Funcionalidades

- **3 rotas REST:** Conforme especificado
- **Programação funcional:** reduce(), forEach() implementados
- **Processamento em memória:** Sem filtros SQL
- **Formato JSON:** Exatamente como solicitado

### Qualidade

- **Consistência:** Padrão uniforme em todas as rotas
- **Legibilidade:** Código bem comentado e estruturado
- **Manutenibilidade:** Funções reutilizáveis
- **Robustez:** Tratamento completo de erros

---

## 🎯 Conclusão

A implementação da **Parte 2** atende completamente aos requisitos solicitados:

1. ✅ **3 rotas REST/GET** implementadas e funcionais
2. ✅ **Programação funcional** utilizada (reduce, forEach)
3. ✅ **Processamento em memória** sem WHERE/GROUP BY
4. ✅ **Formatos JSON** exatamente como especificado
5. ✅ **Código educacional** com explicações detalhadas
6. ✅ **Consistência** com padrões do projeto existente

O sistema está pronto para demonstração e entrega, com documentação completa e testes automatizados para validação das funcionalidades implementadas.

---

**Desenvolvido para:** Hands on Work VII - UNIVALI  
**Projeto:** NAM - Núcleo de Apoio ao Migrante  
**Data:** Janeiro 2025
