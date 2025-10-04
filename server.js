const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

// Inicializar Express e Prisma
const app = express();
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Configuração de porta
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors()); // Permitir requisições de qualquer origem
app.use(express.json()); // Parser para JSON

// Função auxiliar para formatar data no padrão brasileiro
const formatarData = data => {
  const d = new Date(data);
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${dia}/${mes}/${ano}`;
};

// Função auxiliar para formatar valor em moeda brasileira
const formatarValor = valor => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
};

// Função auxiliar para formatar mês/ano no padrão MM/YYYY
const formatarMesAno = data => {
  const d = new Date(data);
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const ano = d.getFullYear();
  return `${mes}/${ano}`;
};

// =============================================================================
// PARTE 1 - ROTA ORIGINAL (Mantida conforme solicitado)
// =============================================================================

// Rota principal - Listar todos os pagamentos com JOIN
app.get('/api/pagamentos', async (req, res) => {
  console.log('📝 Recebida requisição GET /api/pagamentos');

  try {
    // Executar consulta com JOIN usando Prisma
    // IMPORTANTE: Não estamos usando WHERE ou GROUP BY conforme requisito
    const pagamentos = await prisma.pagamento.findMany({
      include: {
        imovel: {
          include: {
            tipoImovel: true,
          },
        },
      },
      orderBy: {
        dataPagamento: 'desc',
      },
    });

    console.log(
      `✅ Consulta executada com sucesso. ${pagamentos.length} registros encontrados.`
    );

    // Processar dados em memória usando JavaScript (map/filter/reduce)
    // Transformar os dados no formato solicitado
    const resultadoFormatado = pagamentos.map(pagamento => ({
      id_venda: pagamento.id,
      data_do_pagamento: formatarData(pagamento.dataPagamento),
      valor_do_pagamento: formatarValor(pagamento.valor),
      codigo_imovel: pagamento.imovel.codigo,
      descricao_imovel: pagamento.imovel.descricao,
      tipo_imovel: pagamento.imovel.tipoImovel.nome,
    }));

    // Calcular estatísticas usando reduce (processamento em memória)
    const estatisticas = pagamentos.reduce(
      (acc, pagamento) => {
        // Total geral
        acc.valorTotal += parseFloat(pagamento.valor);

        // Contagem por tipo de imóvel
        const tipo = pagamento.imovel.tipoImovel.nome;
        acc.porTipo[tipo] = (acc.porTipo[tipo] || 0) + 1;

        // Contagem por imóvel
        const codigo = pagamento.imovel.codigo;
        if (!acc.porImovel[codigo]) {
          acc.porImovel[codigo] = {
            descricao: pagamento.imovel.descricao,
            quantidade: 0,
            valorTotal: 0,
          };
        }
        acc.porImovel[codigo].quantidade++;
        acc.porImovel[codigo].valorTotal += parseFloat(pagamento.valor);

        // Contagem por mês
        const mes = new Date(pagamento.dataPagamento)
          .toISOString()
          .substring(0, 7);
        acc.porMes[mes] = (acc.porMes[mes] || 0) + 1;

        return acc;
      },
      {
        valorTotal: 0,
        porTipo: {},
        porImovel: {},
        porMes: {},
      }
    );

    // Validação: verificar se todos os imóveis têm pelo menos um pagamento
    const imoveisComPagamento = new Set(pagamentos.map(p => p.imovel.codigo));
    const todosImoveis = await prisma.imovel.count();

    console.log(`📊 Estatísticas processadas:`);
    console.log(` - Total de pagamentos: ${pagamentos.length}`);
    console.log(` - Valor total: ${formatarValor(estatisticas.valorTotal)}`);
    console.log(` - Imóveis únicos com pagamento: ${imoveisComPagamento.size}`);
    console.log(` - Total de imóveis no sistema: ${todosImoveis}`);
    console.log(
      ` - Meses com pagamentos: ${Object.keys(estatisticas.porMes).length}`
    );

    // Verificar se todos os imóveis têm pagamentos
    if (imoveisComPagamento.size < todosImoveis) {
      console.warn(
        `⚠️ ATENÇÃO: Existem ${todosImoveis - imoveisComPagamento.size} imóveis sem pagamentos!`
      );
    } else {
      console.log(`✅ Todos os imóveis possuem pelo menos um pagamento.`);
    }

    // Retornar resposta com dados e estatísticas
    res.json({
      sucesso: true,
      mensagem: 'Dados recuperados com sucesso',
      total_registros: pagamentos.length,
      dados: resultadoFormatado,
      estatisticas: {
        valor_total: formatarValor(estatisticas.valorTotal),
        pagamentos_por_tipo: estatisticas.porTipo,
        pagamentos_por_imovel: Object.entries(estatisticas.porImovel).map(
          ([codigo, dados]) => ({
            codigo,
            descricao: dados.descricao,
            quantidade_pagamentos: dados.quantidade,
            valor_total: formatarValor(dados.valorTotal),
          })
        ),
        pagamentos_por_mes: estatisticas.porMes,
        validacao: {
          todos_imoveis_com_pagamento:
            imoveisComPagamento.size === todosImoveis,
          imoveis_com_pagamento: imoveisComPagamento.size,
          total_imoveis: todosImoveis,
        },
      },
    });
  } catch (error) {
    console.error('❌ Erro ao buscar pagamentos:', error);
    res.status(500).json({
      sucesso: false,
      mensagem: 'Erro ao buscar dados de pagamentos',
      erro: error.message,
    });
  }
});

// =============================================================================
// PARTE 2 - NOVAS ROTAS REST SOLICITADAS
// =============================================================================

// Função auxiliar para buscar todos os dados (usada pelas 3 rotas)
const buscarTodosOsDados = async () => {
  return await prisma.pagamento.findMany({
    include: {
      imovel: {
        include: {
          tipoImovel: true,
        },
      },
    },
  });
};

// 1. ROTA: /api/relatorios/pagamentos-por-imovel
// Retorna uma lista com o id de cada imóvel e sua respectiva soma de todos os pagamentos
// Formato: {"18": 7000, "3": 12000, "9": 10000}
app.get('/api/relatorios/pagamentos-por-imovel', async (req, res) => {
  console.log(
    '📊 Recebida requisição GET /api/relatorios/pagamentos-por-imovel'
  );

  try {
    // Buscar todos os dados do banco (sem WHERE ou GROUP BY)
    const pagamentos = await buscarTodosOsDados();
    console.log(
      `✅ Consulta executada com sucesso. ${pagamentos.length} registros encontrados.`
    );

    // Processar dados em memória usando reduce() para agrupar por imóvel e somar valores
    const pagamentosPorImovel = pagamentos.reduce((acc, pagamento) => {
      // Usar o ID do imóvel como chave
      const imovelId = pagamento.imovel.id.toString();

      // Se o imóvel ainda não existe no acumulador, inicializar com 0
      if (!acc[imovelId]) {
        acc[imovelId] = 0;
      }

      // Somar o valor do pagamento ao total do imóvel
      acc[imovelId] += parseFloat(pagamento.valor);

      return acc;
    }, {});

    console.log(
      `📈 Processamento concluído. ${Object.keys(pagamentosPorImovel).length} imóveis processados.`
    );

    // Retornar apenas o JSON solicitado
    res.json(pagamentosPorImovel);
  } catch (error) {
    console.error('❌ Erro ao processar pagamentos por imóvel:', error);
    res.status(500).json({
      erro: 'Erro ao processar dados',
      mensagem: error.message,
    });
  }
});

// 2. ROTA: /api/relatorios/vendas-por-mes
// Retorna uma lista com cada mês/ano e o total de vendas ocorridas no período
// Formato: {"11/2022": 23000, "12/2022": 15000, "01/2023": 1800}
app.get('/api/relatorios/vendas-por-mes', async (req, res) => {
  console.log('📅 Recebida requisição GET /api/relatorios/vendas-por-mes');

  try {
    // Buscar todos os dados do banco (sem WHERE ou GROUP BY)
    const pagamentos = await buscarTodosOsDados();
    console.log(
      `✅ Consulta executada com sucesso. ${pagamentos.length} registros encontrados.`
    );

    // Processar dados em memória usando reduce() para agrupar por mês/ano e somar valores
    const vendasPorMes = pagamentos.reduce((acc, pagamento) => {
      // Formatar a data para MM/YYYY
      const mesAno = formatarMesAno(pagamento.dataPagamento);

      // Se o mês/ano ainda não existe no acumulador, inicializar com 0
      if (!acc[mesAno]) {
        acc[mesAno] = 0;
      }

      // Somar o valor do pagamento ao total do mês/ano
      acc[mesAno] += parseFloat(pagamento.valor);

      return acc;
    }, {});

    console.log(
      `📈 Processamento concluído. ${Object.keys(vendasPorMes).length} períodos processados.`
    );

    // Retornar apenas o JSON solicitado
    res.json(vendasPorMes);
  } catch (error) {
    console.error('❌ Erro ao processar vendas por mês:', error);
    res.status(500).json({
      erro: 'Erro ao processar dados',
      mensagem: error.message,
    });
  }
});

// 3. ROTA: /api/relatorios/percentual-por-tipo
// Retorna uma lista com cada tipo de imóvel e seu respectivo percentual no total de vendas (quantitativas)
// Formato: {"Apartamento": "50%", "Casas": "30%", "Sala comercial": "20%"}
app.get('/api/relatorios/percentual-por-tipo', async (req, res) => {
  console.log('🥧 Recebida requisição GET /api/relatorios/percentual-por-tipo');

  try {
    // Buscar todos os dados do banco (sem WHERE ou GROUP BY)
    const pagamentos = await buscarTodosOsDados();
    console.log(
      `✅ Consulta executada com sucesso. ${pagamentos.length} registros encontrados.`
    );

    // Primeiro: processar dados em memória usando reduce() para contar por tipo de imóvel
    const contagemPorTipo = pagamentos.reduce((acc, pagamento) => {
      const tipoImovel = pagamento.imovel.tipoImovel.nome;

      // Se o tipo ainda não existe no acumulador, inicializar com 0
      if (!acc[tipoImovel]) {
        acc[tipoImovel] = 0;
      }

      // Incrementar contador para este tipo de imóvel
      acc[tipoImovel] += 1;

      return acc;
    }, {});

    // Segundo: calcular o total de vendas para calcular percentuais
    const totalVendas = pagamentos.length;

    // Terceiro: calcular percentuais usando map() e forEach()
    const percentualPorTipo = {};
    Object.entries(contagemPorTipo).forEach(([tipo, quantidade]) => {
      // Calcular percentual: (quantidade / total) * 100
      const percentual = (quantidade / totalVendas) * 100;

      // Arredondar para 1 casa decimal e adicionar símbolo %
      percentualPorTipo[tipo] = `${percentual.toFixed(1)}%`;
    });

    console.log(
      `📈 Processamento concluído. ${Object.keys(percentualPorTipo).length} tipos de imóvel processados.`
    );
    console.log(`📊 Total de vendas: ${totalVendas}`);

    // Retornar apenas o JSON solicitado
    res.json(percentualPorTipo);
  } catch (error) {
    console.error('❌ Erro ao processar percentual por tipo:', error);
    res.status(500).json({
      erro: 'Erro ao processar dados',
      mensagem: error.message,
    });
  }
});

// =============================================================================
// ROTAS AUXILIARES (Mantidas da Parte 1)
// =============================================================================

// Rota de health check
app.get('/health', async (req, res) => {
  try {
    // Verificar conexão com o banco
    await prisma.$queryRaw`SELECT 1`;

    res.json({
      status: 'OK',
      mensagem: 'Sistema operacional',
      banco_de_dados: 'Conectado',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'ERROR',
      mensagem: 'Sistema com problemas',
      banco_de_dados: 'Desconectado',
      erro: error.message,
    });
  }
});

// Rota para informações do sistema
app.get('/api/info', async (req, res) => {
  try {
    const [totalImoveis, totalPagamentos, totalTipos] = await Promise.all([
      prisma.imovel.count(),
      prisma.pagamento.count(),
      prisma.tipoImovel.count(),
    ]);

    res.json({
      sistema: 'Sistema de Gestão de Pagamentos Imobiliários',
      versao: '2.0.0',
      localizacao: 'Santa Catarina, Brasil',
      banco_de_dados: {
        total_imoveis: totalImoveis,
        total_pagamentos: totalPagamentos,
        total_tipos_imovel: totalTipos,
      },
      endpoints_disponiveis: [
        'GET /api/pagamentos - Listar todos os pagamentos com informações completas',
        'GET /api/relatorios/pagamentos-por-imovel - Soma de pagamentos por imóvel',
        'GET /api/relatorios/vendas-por-mes - Total de vendas por mês/ano',
        'GET /api/relatorios/percentual-por-tipo - Percentual de vendas por tipo de imóvel',
        'GET /api/info - Informações do sistema',
        'GET /health - Status do sistema',
      ],
    });
  } catch (error) {
    res.status(500).json({
      erro: 'Erro ao buscar informações do sistema',
      mensagem: error.message,
    });
  }
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'Bem-vindo ao Sistema de Gestão de Pagamentos Imobiliários',
    descricao:
      'API REST para gestão de pagamentos de imóveis em Santa Catarina',
    documentacao: 'Acesse /api/info para mais informações',
    endpoints_principais: [
      '/api/pagamentos',
      '/api/relatorios/pagamentos-por-imovel',
      '/api/relatorios/vendas-por-mes',
      '/api/relatorios/percentual-por-tipo',
    ],
  });
});

// Tratamento de rotas não encontradas
app.use((req, res) => {
  res.status(404).json({
    erro: 'Rota não encontrada',
    mensagem: `A rota ${req.method} ${req.path} não existe`,
    rotas_disponiveis: [
      '/',
      '/api/pagamentos',
      '/api/relatorios/pagamentos-por-imovel',
      '/api/relatorios/vendas-por-mes',
      '/api/relatorios/percentual-por-tipo',
      '/api/info',
      '/health',
    ],
  });
});

// Tratamento global de erros
app.use((err, req, res) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({
    erro: 'Erro interno do servidor',
    mensagem: 'Ocorreu um erro inesperado',
    detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Função para aguardar o banco de dados estar pronto
const aguardarBancoDados = async (tentativas = 30) => {
  for (let i = 0; i < tentativas; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Conexão com banco de dados estabelecida!');
      return true;
    } catch {
      console.log(
        `⏳ Aguardando banco de dados... Tentativa ${i + 1}/${tentativas}`
      );
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  throw new Error(
    'Não foi possível conectar ao banco de dados após múltiplas tentativas'
  );
};

// Iniciar servidor
const iniciarServidor = async () => {
  try {
    console.log('🚀 Iniciando servidor...');

    // Aguardar banco de dados
    await aguardarBancoDados();

    // Iniciar Express
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`✅ Servidor rodando na porta ${PORT}`);
      console.log('');
      console.log('🏘️ Sistema de Gestão de Pagamentos Imobiliários - Parte 2');
      console.log('📍 Focado em imóveis de Santa Catarina');
      console.log(
        '💡 Apoiando decisões de moradia para migrantes e autoridades'
      );
      console.log('');
      console.log('📊 ENDPOINTS DISPONÍVEIS:');
      console.log(
        `📍 Dados completos: http://localhost:${PORT}/api/pagamentos`
      );
      console.log(
        `💰 Pagamentos por imóvel: http://localhost:${PORT}/api/relatorios/pagamentos-por-imovel`
      );
      console.log(
        `📅 Vendas por mês: http://localhost:${PORT}/api/relatorios/vendas-por-mes`
      );
      console.log(
        `🥧 Percentual por tipo: http://localhost:${PORT}/api/relatorios/percentual-por-tipo`
      );
      console.log(
        `📊 Informações do sistema: http://localhost:${PORT}/api/info`
      );
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
};

// Tratamento de sinais para shutdown gracioso
process.on('SIGINT', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Encerrando servidor...');
  await prisma.$disconnect();
  process.exit(0);
});

// Iniciar aplicação
iniciarServidor();
