#!/usr/bin/env node

/**
 * Script de Teste para os Endpoints da Parte 2
 * Sistema de Gestão de Pagamentos Imobiliários - Hands on Work VII
 *
 * Este script testa as 3 rotas REST implementadas na Parte 2
 */

const http = require('http');

// Configuração
const BASE_URL = 'http://localhost:3000';
const ENDPOINTS = [
  {
    name: 'Pagamentos por Imóvel',
    path: '/api/relatorios/pagamentos-por-imovel',
    expectedFormat: 'object with imovel IDs as keys and values as numbers',
  },
  {
    name: 'Vendas por Mês',
    path: '/api/relatorios/vendas-por-mes',
    expectedFormat: 'object with MM/YYYY as keys and values as numbers',
  },
  {
    name: 'Percentual por Tipo',
    path: '/api/relatorios/percentual-por-tipo',
    expectedFormat:
      'object with tipo names as keys and percentage strings as values',
  },
];

// Função para fazer requisição HTTP
function fazerRequisicao(path) {
  return new Promise((resolve, reject) => {
    const url = `${BASE_URL}${path}`;

    http
      .get(url, res => {
        let data = '';

        res.on('data', chunk => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({
              statusCode: res.statusCode,
              data: jsonData,
              headers: res.headers,
            });
          } catch (error) {
            reject(new Error(`Erro ao fazer parse do JSON: ${error.message}`));
          }
        });
      })
      .on('error', error => {
        reject(error);
      });
  });
}

// Função para validar formato dos dados
function validarFormato(endpoint, data) {
  const errors = [];

  switch (endpoint.path) {
    case '/api/relatorios/pagamentos-por-imovel':
      if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push('Dados devem ser um objeto, não um array');
      }
      // Verificar se as chaves são strings e valores são números
      for (const [key, value] of Object.entries(data)) {
        if (typeof key !== 'string') {
          errors.push(`Chave deve ser string, encontrado: ${typeof key}`);
        }
        if (typeof value !== 'number') {
          errors.push(
            `Valor deve ser number, encontrado: ${typeof value} para chave "${key}"`
          );
        }
      }
      break;

    case '/api/relatorios/vendas-por-mes':
      if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push('Dados devem ser um objeto, não um array');
      }
      // Verificar formato MM/YYYY nas chaves
      for (const [key, value] of Object.entries(data)) {
        if (!/^\d{2}\/\d{4}$/.test(key)) {
          errors.push(
            `Chave deve estar no formato MM/YYYY, encontrado: "${key}"`
          );
        }
        if (typeof value !== 'number') {
          errors.push(
            `Valor deve ser number, encontrado: ${typeof value} para chave "${key}"`
          );
        }
      }
      break;

    case '/api/relatorios/percentual-por-tipo':
      if (typeof data !== 'object' || Array.isArray(data)) {
        errors.push('Dados devem ser um objeto, não um array');
      }
      // Verificar se valores são strings com %
      for (const [key, value] of Object.entries(data)) {
        if (typeof key !== 'string') {
          errors.push(`Chave deve ser string, encontrado: ${typeof key}`);
        }
        if (typeof value !== 'string' || !value.includes('%')) {
          errors.push(
            `Valor deve ser string com %, encontrado: "${value}" para chave "${key}"`
          );
        }
      }
      break;
  }

  return errors;
}

// Função para imprimir dados formatados
function imprimirDados(endpoint, data) {
  console.log(`\n📊 Dados retornados para "${endpoint.name}":`);
  console.log('='.repeat(60));

  if (typeof data === 'object' && !Array.isArray(data)) {
    // Ordenar por chave para melhor visualização
    const sortedEntries = Object.entries(data).sort(([a], [b]) => {
      if (endpoint.path === '/api/relatorios/vendas-por-mes') {
        // Para vendas por mês, ordenar cronologicamente
        const [mesA, anoA] = a.split('/');
        const [mesB, anoB] = b.split('/');
        const dateA = new Date(anoA, mesA - 1);
        const dateB = new Date(anoB, mesB - 1);
        return dateA - dateB;
      }
      return a.localeCompare(b);
    });

    sortedEntries.forEach(([key, value]) => {
      console.log(`  ${key}: ${value}`);
    });
  } else {
    console.log(JSON.stringify(data, null, 2));
  }

  console.log(`\n📈 Total de itens: ${Object.keys(data).length}`);
}

// Função principal de teste
async function executarTestes() {
  console.log('🚀 Iniciando testes dos endpoints da Parte 2');
  console.log('📍 Base URL:', BASE_URL);
  console.log('⏰ Timestamp:', new Date().toISOString());
  console.log('\n' + '='.repeat(80));

  let testesPassou = 0;
  let testesFalhou = 0;

  for (const endpoint of ENDPOINTS) {
    console.log(`\n🔍 Testando: ${endpoint.name}`);
    console.log(`📍 URL: ${BASE_URL}${endpoint.path}`);
    console.log(`📋 Formato esperado: ${endpoint.expectedFormat}`);

    try {
      // Fazer requisição
      const response = await fazerRequisicao(endpoint.path);

      // Verificar status code
      if (response.statusCode !== 200) {
        throw new Error(`Status code inesperado: ${response.statusCode}`);
      }

      // Validar formato dos dados
      const erros = validarFormato(endpoint, response.data);

      if (erros.length > 0) {
        console.log('❌ FALHOU - Erros de validação:');
        erros.forEach(erro => console.log(`   - ${erro}`));
        testesFalhou++;
      } else {
        console.log('✅ PASSOU - Formato válido');
        imprimirDados(endpoint, response.data);
        testesPassou++;
      }
    } catch (error) {
      console.log('❌ FALHOU - Erro na requisição:');
      console.log(`   - ${error.message}`);
      testesFalhou++;
    }

    console.log('\n' + '-'.repeat(60));
  }

  // Resumo final
  console.log('\n' + '='.repeat(80));
  console.log('📊 RESUMO DOS TESTES');
  console.log('='.repeat(80));
  console.log(`✅ Testes que passaram: ${testesPassou}`);
  console.log(`❌ Testes que falharam: ${testesFalhou}`);
  console.log(`📈 Total de testes: ${testesPassou + testesFalhou}`);

  if (testesFalhou === 0) {
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✨ Os endpoints estão funcionando corretamente.');
  } else {
    console.log('\n⚠️  ALGUNS TESTES FALHARAM!');
    console.log('🔧 Verifique os erros acima e corrija os problemas.');
  }

  console.log('\n💡 Para testar manualmente, use:');
  ENDPOINTS.forEach(endpoint => {
    console.log(`   curl ${BASE_URL}${endpoint.path}`);
  });
}

// Verificar se o servidor está rodando
async function verificarServidor() {
  try {
    const response = await fazerRequisicao('/health');
    if (response.statusCode === 200) {
      console.log('✅ Servidor está rodando e respondendo');
      return true;
    }
  } catch (error) {
    console.log('❌ Servidor não está respondendo');
    console.log(`   Erro: ${error.message}`);
    console.log('\n💡 Certifique-se de que o servidor está rodando:');
    console.log('   npm start');
    return false;
  }
}

// Executar verificação e testes
async function main() {
  console.log('🏥 Verificando se o servidor está rodando...');

  const servidorOk = await verificarServidor();

  if (servidorOk) {
    await executarTestes();
  } else {
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error.message);
    process.exit(1);
  });
}

module.exports = { executarTestes, fazerRequisicao, validarFormato };
