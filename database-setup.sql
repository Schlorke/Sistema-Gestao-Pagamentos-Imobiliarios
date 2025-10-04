-- =============================================================================
-- SCRIPT DE CONFIGURAÇÃO DO BANCO DE DADOS
-- Sistema de Gestão de Pagamentos Imobiliários - Hands on Work VII
-- =============================================================================

-- Criar banco de dados
CREATE DATABASE IF NOT EXISTS sistema_pagamentos_imobiliarios;
USE sistema_pagamentos_imobiliarios;

-- =============================================================================
-- CRIAÇÃO DAS TABELAS
-- =============================================================================

-- Tabela de tipos de imóveis
CREATE TABLE IF NOT EXISTS `tipos_imovel` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nome` VARCHAR(100) NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de imóveis
CREATE TABLE IF NOT EXISTS `imoveis` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `codigo` VARCHAR(50) NOT NULL UNIQUE,
    `descricao` VARCHAR(255) NOT NULL,
    `tipoImovelId` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (`tipoImovelId`),
    FOREIGN KEY (`tipoImovelId`) REFERENCES `tipos_imovel`(`id`)
);

-- Tabela de pagamentos
CREATE TABLE IF NOT EXISTS `pagamentos` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `dataPagamento` DATE NOT NULL,
    `valor` DECIMAL(10,2) NOT NULL,
    `imovelId` INT NOT NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX (`imovelId`),
    INDEX (`dataPagamento`),
    FOREIGN KEY (`imovelId`) REFERENCES `imoveis`(`id`)
);

-- =============================================================================
-- INSERÇÃO DE DADOS DE TESTE
-- =============================================================================

-- Inserir tipos de imóveis
INSERT INTO `tipos_imovel` (`nome`) VALUES
('Apartamento'),
('Casa'),
('Sala Comercial'),
('Terreno'),
('Galpão'),
('Loja'),
('Escritório'),
('Studio');

-- Inserir imóveis (8+ imóveis conforme solicitado)
INSERT INTO `imoveis` (`codigo`, `descricao`, `tipoImovelId`) VALUES
('AP001', 'Apartamento 100m² em condomínio fechado', 1),
('AP002', 'Apartamento 80m² com 2 quartos', 1),
('CS001', 'Casa térrea 120m² com quintal', 2),
('CS002', 'Casa sobrado 200m² com garagem', 2),
('SC001', 'Sala comercial 50m² no centro', 3),
('TR001', 'Terreno 500m² residencial', 4),
('GL001', 'Galpão 300m² industrial', 5),
('LJ001', 'Loja 80m² comercial');

-- Inserir pagamentos (30+ pagamentos em 5+ meses distintos)
INSERT INTO `pagamentos` (`dataPagamento`, `valor`, `imovelId`) VALUES
-- Janeiro 2023
('2023-01-15', 2500.00, 1),
('2023-01-20', 3200.00, 2),
('2023-01-25', 1800.00, 3),

-- Fevereiro 2023
('2023-02-10', 2500.00, 1),
('2023-02-15', 3200.00, 2),
('2023-02-20', 1800.00, 3),
('2023-02-28', 4500.00, 4),

-- Março 2023
('2023-03-05', 2500.00, 1),
('2023-03-10', 3200.00, 2),
('2023-03-15', 1800.00, 3),
('2023-03-20', 4500.00, 4),
('2023-03-25', 2200.00, 5),

-- Abril 2023
('2023-04-01', 2500.00, 1),
('2023-04-05', 3200.00, 2),
('2023-04-10', 1800.00, 3),
('2023-04-15', 4500.00, 4),
('2023-04-20', 2200.00, 5),
('2023-04-25', 1500.00, 6),

-- Maio 2023
('2023-05-01', 2500.00, 1),
('2023-05-05', 3200.00, 2),
('2023-05-10', 1800.00, 3),
('2023-05-15', 4500.00, 4),
('2023-05-20', 2200.00, 5),
('2023-05-25', 1500.00, 6),
('2023-05-30', 3800.00, 7),

-- Junho 2023
('2023-06-05', 2500.00, 1),
('2023-06-10', 3200.00, 2),
('2023-06-15', 1800.00, 3),
('2023-06-20', 4500.00, 4),
('2023-06-25', 2200.00, 5),
('2023-06-30', 1500.00, 6),

-- Julho 2023
('2023-07-05', 2500.00, 1),
('2023-07-10', 3200.00, 2),
('2023-07-15', 1800.00, 3),
('2023-07-20', 4500.00, 4),
('2023-07-25', 2800.00, 8);

-- =============================================================================
-- CONSULTA DE VERIFICAÇÃO (JOIN entre todas as tabelas)
-- =============================================================================

-- Esta consulta retorna uma estrutura análoga à apresentada no enunciado
SELECT 
    p.id as id_venda,
    p.dataPagamento as data_do_pagamento,
    p.valor as valor_do_pagamento,
    i.codigo as codigo_imovel,
    i.descricao as descricao_imovel,
    t.nome as tipo_imovel
FROM pagamentos p
INNER JOIN imoveis i ON p.imovelId = i.id
INNER JOIN tipos_imovel t ON i.tipoImovelId = t.id
ORDER BY p.dataPagamento DESC;

-- =============================================================================
-- CONSULTAS DE VALIDAÇÃO
-- =============================================================================

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
    COUNT(p.id) as total_pagamentos,
    COALESCE(SUM(p.valor), 0) as valor_total
FROM imoveis i
LEFT JOIN pagamentos p ON i.id = p.imovelId
GROUP BY i.id, i.codigo, i.descricao
ORDER BY i.codigo;

-- Verificar pagamentos por mês
SELECT 
    DATE_FORMAT(dataPagamento, '%m/%Y') as mes_ano,
    COUNT(*) as total_pagamentos,
    SUM(valor) as valor_total
FROM pagamentos
GROUP BY DATE_FORMAT(dataPagamento, '%m/%Y')
ORDER BY dataPagamento;
