-- Schema da tabela de consultas
-- Execute este script se a tabela não existir

CREATE TABLE IF NOT EXISTS `consultas` (
  `id` varchar(255) NOT NULL,
  `utente_id` varchar(255) NOT NULL,
  `medico_id` varchar(255) DEFAULT NULL,
  `data_hora` datetime NOT NULL,
  `duracao` int NOT NULL DEFAULT 30,
  `tipo_consulta` varchar(100) DEFAULT NULL,
  `procedimento` text DEFAULT NULL,
  `status` enum('agendada','confirmada','realizada','cancelada','faltou','em_atendimento') NOT NULL DEFAULT 'agendada',
  `observacoes` text DEFAULT NULL,
  `valor_estimado` decimal(10,2) DEFAULT NULL,
  `classificacao_risco` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utente` (`utente_id`),
  KEY `idx_medico` (`medico_id`),
  KEY `idx_data_hora` (`data_hora`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

