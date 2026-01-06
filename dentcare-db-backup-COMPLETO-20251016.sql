-- MySQL dump 10.13  Distrib 8.0.43, for Linux (x86_64)
--
-- Host: localhost    Database: dentcare_db
-- ------------------------------------------------------
-- Server version	8.0.43-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `consultas`
--

DROP TABLE IF EXISTS `consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `consultas` (
  `id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `utente_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `medico_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_hora` datetime NOT NULL,
  `duracao` int DEFAULT '30',
  `tipo_consulta` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `procedimento` text COLLATE utf8mb4_unicode_ci,
  `status` enum('agendada','confirmada','realizada','cancelada','faltou','em_atendimento') COLLATE utf8mb4_unicode_ci DEFAULT 'agendada',
  `observacoes` text COLLATE utf8mb4_unicode_ci,
  `valor_estimado` decimal(10,2) DEFAULT NULL,
  `classificacao_risco` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `utente_id` (`utente_id`),
  KEY `idx_data_hora` (`data_hora`),
  KEY `idx_medico` (`medico_id`),
  KEY `idx_status` (`status`),
  CONSTRAINT `consultas_ibfk_1` FOREIGN KEY (`utente_id`) REFERENCES `utentes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `consultas`
--

LOCK TABLES `consultas` WRITE;
/*!40000 ALTER TABLE `consultas` DISABLE KEYS */;
/*!40000 ALTER TABLE `consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `endodontia`
--

DROP TABLE IF EXISTS `endodontia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `endodontia` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroDente` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroCanais` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `comprimentoTrabalho` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `tecnicaInstrumentacao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `materialObturacao` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataInicio` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataFinalizacao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('em_andamento','concluido','retratamento') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'em_andamento',
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `endodontia`
--

LOCK TABLES `endodontia` WRITE;
/*!40000 ALTER TABLE `endodontia` DISABLE KEYS */;
/*!40000 ALTER TABLE `endodontia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagens`
--

DROP TABLE IF EXISTS `imagens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagens` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo` enum('raio_x','fotografia','tomografia','scanner_3d','outro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `categoria` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomeArquivo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tamanho` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataImagem` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `descricao` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagens`
--

LOCK TABLES `imagens` WRITE;
/*!40000 ALTER TABLE `imagens` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `implantes`
--

DROP TABLE IF EXISTS `implantes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `implantes` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `posicao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `marca` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modelo` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diametro` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comprimento` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lote` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataColocacao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataCarga` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tipoProtese` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('planejado','colocado','osseointegrado','protese_instalada','falha') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'planejado',
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `implantes`
--

LOCK TABLES `implantes` WRITE;
/*!40000 ALTER TABLE `implantes` DISABLE KEYS */;
/*!40000 ALTER TABLE `implantes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `laboratorio`
--

DROP TABLE IF EXISTS `laboratorio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `laboratorio` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipoTrabalho` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dentes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `laboratorioNome` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cor` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `material` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataEnvio` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataPrevisao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataRecepcao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataInstalacao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `custo` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` enum('pendente','enviado','em_producao','recebido','instalado','ajuste_necessario') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'pendente',
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `laboratorio`
--

LOCK TABLES `laboratorio` WRITE;
/*!40000 ALTER TABLE `laboratorio` DISABLE KEYS */;
/*!40000 ALTER TABLE `laboratorio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `odontograma`
--

DROP TABLE IF EXISTS `odontograma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `odontograma` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroDente` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `estado` enum('saudavel','carie','restauracao','coroa','ponte','implante','extraido','ausente','tratamento_canal') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'saudavel',
  `faces` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `odontograma`
--

LOCK TABLES `odontograma` WRITE;
/*!40000 ALTER TABLE `odontograma` DISABLE KEYS */;
/*!40000 ALTER TABLE `odontograma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ortodontia`
--

DROP TABLE IF EXISTS `ortodontia`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ortodontia` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipoAparelho` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataInicio` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `previsaoTermino` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dataTermino` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `diagnostico` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `planoTratamento` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `status` enum('planejamento','ativo','contencao','concluido') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT 'planejamento',
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ortodontia`
--

LOCK TABLES `ortodontia` WRITE;
/*!40000 ALTER TABLE `ortodontia` DISABLE KEYS */;
/*!40000 ALTER TABLE `ortodontia` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ortodontia_consultas`
--

DROP TABLE IF EXISTS `ortodontia_consultas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ortodontia_consultas` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `ortodontiaId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataConsulta` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `procedimentos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `proximaConsulta` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ortodontia_consultas`
--

LOCK TABLES `ortodontia_consultas` WRITE;
/*!40000 ALTER TABLE `ortodontia_consultas` DISABLE KEYS */;
/*!40000 ALTER TABLE `ortodontia_consultas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `periodontograma`
--

DROP TABLE IF EXISTS `periodontograma`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `periodontograma` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroDente` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataAvaliacao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `periodontograma`
--

LOCK TABLES `periodontograma` WRITE;
/*!40000 ALTER TABLE `periodontograma` DISABLE KEYS */;
/*!40000 ALTER TABLE `periodontograma` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `prescricoes`
--

DROP TABLE IF EXISTS `prescricoes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `prescricoes` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `utenteId` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataPrescricao` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `medicamentos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `diagnostico` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `observacoes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `prescricoes`
--

LOCK TABLES `prescricoes` WRITE;
/*!40000 ALTER TABLE `prescricoes` DISABLE KEYS */;
/*!40000 ALTER TABLE `prescricoes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `email` varchar(320) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loginMethod` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` timestamp NULL DEFAULT (now()),
  `lastSignedIn` timestamp NULL DEFAULT (now()),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `utentes`
--

DROP TABLE IF EXISTS `utentes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `utentes` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `numeroUtente` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nomeCompleto` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `dataNascimento` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `genero` enum('M','F','Outro') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `nif` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `numUtenteSns` varchar(9) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `fotoPerfil` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `contacto` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `morada` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `infoMedica` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` enum('ativo','inativo','arquivado') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ativo',
  `tags` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `criadoPor` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `criadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `atualizadoEm` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `numeroUtente` (`numeroUtente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `utentes`
--

LOCK TABLES `utentes` WRITE;
/*!40000 ALTER TABLE `utentes` DISABLE KEYS */;
INSERT INTO `utentes` VALUES ('5u_1FB4TI_8QIHlAW1VsJ','UT1760644109408500','Ayrton Senna da Silva','1960-03-21','M','234567890',NULL,NULL,'{\"telefone\":\"+55 11 97654-3210\",\"email\":null,\"telemovel\":\"+55 11 97654-3210\",\"telefoneEmergencia\":null}','{\"rua\":\"Rua Oscar Freire\",\"numero\":\"500\",\"codigoPostal\":\"1420-001\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"A+\",\"notasImportantes\":\"Lenda da Fórmula 1\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:48:29','2025-10-16 19:48:29'),('7K-LzEn2FzvzFHx3Y1gI4','UT1760644146436464','Ayrton Senna da Silva','1960-03-21','M','234567890',NULL,NULL,'{\"telefone\":\"+55 11 97654-3210\",\"email\":null,\"telemovel\":\"+55 11 97654-3210\",\"telefoneEmergencia\":null}','{\"rua\":\"Rua Oscar Freire\",\"numero\":\"500\",\"codigoPostal\":\"1420-001\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"A+\",\"notasImportantes\":\"Lenda da Fórmula 1\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:49:06','2025-10-16 19:49:06'),('D1WZtDnmUeKxTwMpOXcVd','UT1760644133949885','Ayrton Senna da Silva','1960-03-21','M','234567890',NULL,NULL,'{\"telefone\":\"+55 11 97654-3210\",\"email\":null,\"telemovel\":\"+55 11 97654-3210\",\"telefoneEmergencia\":null}','{\"rua\":\"Rua Oscar Freire\",\"numero\":\"500\",\"codigoPostal\":\"1420-001\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"A+\",\"notasImportantes\":\"Lenda da Fórmula 1\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:48:54','2025-10-16 19:48:54'),('je1Oyyqabff_qP6TAHyPH','UT1760644133949981','Pelé Edson Arantes','1940-10-23','M','123456789',NULL,NULL,'{\"telefone\":\"+55 11 98765-4321\",\"email\":\"pele@example.com\",\"telemovel\":\"+55 11 98765-4321\",\"telefoneEmergencia\":null}','{\"rua\":\"Avenida Paulista\",\"numero\":\"1000\",\"codigoPostal\":\"1310-100\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"O+\",\"notasImportantes\":\"Paciente VIP - Rei do Futebol\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:48:54','2025-10-16 19:48:54'),('kUuiLk2dT_8ZfMmlv_Jh8','UT1760644146435262','Pelé Edson Arantes','1940-10-23','M','123456789',NULL,NULL,'{\"telefone\":\"+55 11 98765-4321\",\"email\":\"pele@example.com\",\"telemovel\":\"+55 11 98765-4321\",\"telefoneEmergencia\":null}','{\"rua\":\"Avenida Paulista\",\"numero\":\"1000\",\"codigoPostal\":\"1310-100\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"O+\",\"notasImportantes\":\"Paciente VIP - Rei do Futebol\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:49:06','2025-10-16 19:49:06'),('OlNuCABjbb9H06515e9m2','UT1760644146436470','Gisele Bündchen','1980-07-20','F',NULL,NULL,NULL,'{\"telefone\":\"+55 21 96543-2109\",\"email\":null,\"telemovel\":\"+55 21 96543-2109\",\"telefoneEmergencia\":null}',NULL,'{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"AB+\",\"notasImportantes\":\"Supermodelo internacional\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:49:06','2025-10-16 19:49:06'),('PXxSzBoTk7g3DaYj7qe7N','UT1760644109408432','Pelé Edson Arantes','1940-10-23','M','123456789',NULL,NULL,'{\"telefone\":\"+55 11 98765-4321\",\"email\":\"pele@example.com\",\"telemovel\":\"+55 11 98765-4321\",\"telefoneEmergencia\":null}','{\"rua\":\"Avenida Paulista\",\"numero\":\"1000\",\"codigoPostal\":\"1310-100\",\"localidade\":\"São Paulo\",\"distrito\":\"São Paulo\"}','{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[],\"classificacaoAsa\":\"I\",\"grupoSanguineo\":\"O+\",\"notasImportantes\":\"Paciente VIP - Rei do Futebol\"}','ativo','[\"VIP\",\"Famoso\"]','dev-user-001','2025-10-16 19:48:29','2025-10-16 19:48:29'),('q2EVPCY9gUaw4Bz2ZnF5k','UT1760644146436236','Ronaldo Luís Nazário de Lima','1976-09-18','M',NULL,NULL,NULL,'{\"telefone\":\"+55 21 95432-1098\",\"email\":null,\"telemovel\":\"+55 21 95432-1098\",\"telefoneEmergencia\":null}',NULL,'{\"alergias\":[],\"medicamentos\":[],\"condicoesMedicas\":[\"Histórico de lesões no joelho\"],\"classificacaoAsa\":\"II\",\"grupoSanguineo\":\"O+\",\"notasImportantes\":\"Fenômeno - Bicampeão Mundial\"}','ativo','[\"VIP\",\"Famoso\",\"Atleta\"]','dev-user-001','2025-10-16 19:49:06','2025-10-16 19:49:06');
/*!40000 ALTER TABLE `utentes` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-10-16 18:21:26
