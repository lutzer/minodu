/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.4.8-MariaDB, for Linux (aarch64)
--
-- Host: minodu-database    Database: minodu
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `backend_user_status`
--

DROP TABLE IF EXISTS `backend_user_status`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_user_status` (
  `id` int NOT NULL AUTO_INCREMENT,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `name` varchar(60) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_user_status`
--

LOCK TABLES `backend_user_status` WRITE;
/*!40000 ALTER TABLE `backend_user_status` DISABLE KEYS */;
INSERT INTO `backend_user_status` VALUES
(1,'2026-01-28 14:12:31.409239','2026-01-28 14:12:31.409239',NULL,'ACTIVE'),
(2,'2026-01-28 14:12:31.412136','2026-01-28 14:12:31.412136',NULL,'BLOCKED');
/*!40000 ALTER TABLE `backend_user_status` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_role`
--

DROP TABLE IF EXISTS `backend_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_role` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_role` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_role`
--

LOCK TABLES `backend_role` WRITE;
/*!40000 ALTER TABLE `backend_role` DISABLE KEYS */;
INSERT INTO `backend_role` VALUES
(1,'ADMIN','2025-04-21 14:50:54.601289','2025-04-21 14:50:54.601289',NULL),
(2,'USER','2025-04-21 14:50:54.608930','2025-04-21 14:50:54.608930',NULL);
/*!40000 ALTER TABLE `backend_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_product_category`
--

DROP TABLE IF EXISTS `backend_product_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_product_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_product_category` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_product_category`
--

LOCK TABLES `backend_product_category` WRITE;
/*!40000 ALTER TABLE `backend_product_category` DISABLE KEYS */;
INSERT INTO `backend_product_category` VALUES
(1,'CÉRÉALES','','2025-05-18 23:58:11.614271','2025-08-05 20:54:38.000000',NULL),
(2,'TUBERCULES','geminigen-843def7e6b.png','2025-12-01 16:06:34.589073','2025-12-01 16:06:34.589073',NULL);
/*!40000 ALTER TABLE `backend_product_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_product`
--

DROP TABLE IF EXISTS `backend_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `sales_unit` varchar(30) NOT NULL,
  `price` int NOT NULL,
  `audio_url` varchar(60) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `productCategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_product` (`name`),
  KEY `FK_55c25bbe472ab140d9ed2ab4a3d` (`productCategoryId`),
  CONSTRAINT `FK_55c25bbe472ab140d9ed2ab4a3d` FOREIGN KEY (`productCategoryId`) REFERENCES `backend_product_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_product`
--

LOCK TABLES `backend_product` WRITE;
/*!40000 ALTER TABLE `backend_product` DISABLE KEYS */;
INSERT INTO `backend_product` VALUES
(1,'le maïs','mais-11056710210fa.jpg','Céréale polyvalente utilisée dans de nombreux plats, riche en glucides et facile à transformer.','bol',400,NULL,'2025-12-01 15:54:09.484732','2025-12-01 16:45:47.000000',NULL,1),
(2,'L\'haricot','haricot-d5e10b2982d.jpg','Légumineuse nutritive, riche en protéines végétales, idéale pour une alimentation équilibrée.','bol',500,NULL,'2025-12-01 15:58:03.257256','2025-12-01 16:51:34.000000',NULL,1);
/*!40000 ALTER TABLE `backend_product` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_post_tag`
--

DROP TABLE IF EXISTS `backend_post_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_post_tag` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_post_tag` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_post_tag`
--

LOCK TABLES `backend_post_tag` WRITE;
/*!40000 ALTER TABLE `backend_post_tag` DISABLE KEYS */;
INSERT INTO `backend_post_tag` VALUES
(1,'GOMBO','okra-a75716f59a.png','2025-11-27 13:54:46.752157','2025-12-01 22:09:02.000000',NULL),
(2,'BIOPESTICIDE','fertilizer-787b4741c3.png','2025-11-27 13:55:42.077749','2025-12-01 22:09:34.000000',NULL),
(3,'LES RAVAGEURS','schadlinge-1810f433dd8.png','2025-11-27 13:56:20.727811','2025-12-01 22:10:07.000000',NULL),
(4,'INNOVATION','innovation-6592c27dde.png','2025-11-27 13:56:45.871114','2025-12-01 22:10:36.000000',NULL),
(5,'TERMITE','keine-bugs-d135fbad94.png','2025-11-27 13:57:28.033632','2025-12-01 22:10:56.000000',NULL),
(6,'RESEAU LOCAL','kommunikat-ab2733b61b.png','2025-11-27 13:58:08.646185','2025-12-01 22:11:24.000000',NULL),
(7,'NEEM','feuille-7fc61079c67.png','2025-11-27 13:58:40.674818','2025-12-01 22:12:11.000000',NULL),
(8,'Scheresse','anlage-bee5e31c3f.png','2025-11-27 13:59:51.333341','2025-12-01 22:12:43.000000',NULL),
(9,'POULE','geminigen-d210021b78.png','2025-11-27 15:06:41.540503','2025-12-01 22:13:17.000000',NULL),
(10,'FEUILLES VERTES','feuille-3e7dbc28e4.png','2025-11-28 07:12:34.773419','2025-12-01 22:13:45.000000',NULL),
(11,'SOL','sol-55413b2dc6.png','2025-11-28 07:28:17.621625','2025-12-01 22:14:37.000000',NULL),
(12,'FUMIER','fumier-88db7f767c.png','2025-11-28 07:28:37.247003','2025-12-01 22:15:01.000000',NULL),
(13,'CHOUX','choux-413363549a.png','2025-11-28 09:37:25.362499','2025-12-01 22:15:31.000000',NULL),
(14,'RIZ','riz-1-6bfc296c34.png','2025-11-28 09:57:23.205999','2025-12-01 22:15:55.000000',NULL),
(15,'CHAMPIGNON','champignon-36ad68eeb4.png','2025-11-28 09:57:55.979768','2025-12-01 22:16:20.000000',NULL),
(20,'AGRICULTURE','agricultur-bee73db10da.png','2025-12-01 22:17:06.785079','2025-12-01 22:17:06.785079',NULL),
(21,'SUBSTRATS DE RIZ','riz-9549986ff5.png','2025-12-01 22:51:01.580707','2025-12-01 22:51:01.580707',NULL);
/*!40000 ALTER TABLE `backend_post_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_post_resource`
--

DROP TABLE IF EXISTS `backend_post_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_post_resource` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_post_resource` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_post_resource`
--

LOCK TABLES `backend_post_resource` WRITE;
/*!40000 ALTER TABLE `backend_post_resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `backend_post_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_post_category`
--

DROP TABLE IF EXISTS `backend_post_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_post_category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL,
  `nameKb` varchar(60) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_post_category` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_post_category`
--

LOCK TABLES `backend_post_category` WRITE;
/*!40000 ALTER TABLE `backend_post_category` DISABLE KEYS */;
INSERT INTO `backend_post_category` VALUES
(1,'PLANTES','','','2025-04-21 15:34:46.717247','2025-12-01 22:36:32.000000',NULL),
(2,'SOL','','','2025-04-21 15:35:52.018383','2025-12-01 22:18:10.000000',NULL),
(3,'AUTRES','','','2025-04-21 15:36:23.150296','2025-04-21 15:36:23.150296',NULL),
(4,'ELEVAGE','','','2025-11-27 15:01:48.456801','2025-11-27 15:01:48.456801',NULL),
(5,'CONSERVATION DES RECOLTES','','','2025-11-27 15:03:37.654837','2025-11-27 15:03:37.654837',NULL);
/*!40000 ALTER TABLE `backend_post_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_posts_tags`
--

DROP TABLE IF EXISTS `backend_posts_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_posts_tags` (
  `postId` int NOT NULL,
  `tagId` int NOT NULL,
  PRIMARY KEY (`postId`,`tagId`),
  KEY `IDX_53e5480c9d759a5ef8c1c920ce` (`postId`),
  KEY `IDX_81860194f7c142d25b060e465c` (`tagId`),
  CONSTRAINT `FK_53e5480c9d759a5ef8c1c920ce8` FOREIGN KEY (`postId`) REFERENCES `backend_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_81860194f7c142d25b060e465c5` FOREIGN KEY (`tagId`) REFERENCES `backend_post_tag` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_posts_tags`
--

LOCK TABLES `backend_posts_tags` WRITE;
/*!40000 ALTER TABLE `backend_posts_tags` DISABLE KEYS */;
INSERT INTO `backend_posts_tags` VALUES
(1,2),
(1,3),
(2,14),
(2,15),
(3,2),
(3,3),
(3,7),
(4,12),
(5,2),
(5,13),
(6,10),
(7,11),
(8,2),
(8,3),
(9,11),
(10,9),
(10,12),
(11,11),
(12,6),
(13,4),
(13,6),
(14,2),
(14,7),
(15,5),
(16,11),
(17,1),
(17,2),
(18,2),
(19,10),
(20,11);
/*!40000 ALTER TABLE `backend_posts_tags` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_posts_resources`
--

DROP TABLE IF EXISTS `backend_posts_resources`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_posts_resources` (
  `postId` int NOT NULL,
  `resourceId` int NOT NULL,
  PRIMARY KEY (`postId`,`resourceId`),
  KEY `IDX_ec24369023b9eaac72e1d423b0` (`postId`),
  KEY `IDX_1e595a72d671d4afdaec209b93` (`resourceId`),
  CONSTRAINT `FK_1e595a72d671d4afdaec209b933` FOREIGN KEY (`resourceId`) REFERENCES `backend_post_resource` (`id`),
  CONSTRAINT `FK_ec24369023b9eaac72e1d423b03` FOREIGN KEY (`postId`) REFERENCES `backend_post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_posts_resources`
--

LOCK TABLES `backend_posts_resources` WRITE;
/*!40000 ALTER TABLE `backend_posts_resources` DISABLE KEYS */;
/*!40000 ALTER TABLE `backend_posts_resources` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `backend_post`
--

DROP TABLE IF EXISTS `backend_post`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `backend_post` (
  `id` int NOT NULL AUTO_INCREMENT,
  `author` varchar(60) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `attachmentKb` varchar(255) DEFAULT NULL,
  `attachmentPdf` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `userId` int DEFAULT NULL,
  `postCategoryId` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_a285b71ad756ab7bf221b980f02` (`userId`),
  KEY `FK_f9a0c4448a8f9d20fff3c113353` (`postCategoryId`),
  CONSTRAINT `FK_a285b71ad756ab7bf221b980f02` FOREIGN KEY (`userId`) REFERENCES `backend_user` (`id`),
  CONSTRAINT `FK_f9a0c4448a8f9d20fff3c113353` FOREIGN KEY (`postCategoryId`) REFERENCES `backend_post_category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `backend_post`
--

LOCK TABLES `backend_post` WRITE;
/*!40000 ALTER TABLE `backend_post` DISABLE KEYS */;
INSERT INTO `backend_post` VALUES
(1,'AGOLO Atajou','Evaluation de l’efficacité des biopesticides sur les ravageurs du choux','Cette étude intervient pour la protection du chou','photo-titr-67c3cb3b01.png','15fragol-2e76a649b4.mp3','15kbagol-a3c16dea90.mp3','scripts-ag-90d6dc763e.pdf','2025-11-28 09:23:02.262079','2025-12-01 22:26:04.000000',NULL,1,1),
(2,'OKOTAN Balkiss','Production de champignons comestibles de qualité','Effet des substrats de riz et de soja sur le rendement et la qualité minérale des champignons comestibles','photo-titr-856a2493b2.jpg','16frokot-28769794d7.mp3','16kbokot-bbfa34e775.mp3','effetdes-df7a6747c1.pdf','2025-11-28 12:06:57.529024','2025-12-01 22:49:27.000000',NULL,1,3),
(3,'NAOU Josué','Etude sur l’efficacité des extraits de graines de neem contre les insectes ravageurs de l’oseille de guinée','Étude du potentiel activité phytosanitaire des extraits aqueux de grains de neem (Azadirachta indica) contre les chenilles et altises défoliatrices des feuilles de l\'oseille de guinée(Hibiscus sabdariffa L.)','photo-titr-96c90680dc.png','20frnaou-768713dc2e.mp3','20kbnaou-9431a26f15.mp3','naouetude-0661f369110.pdf','2025-11-28 12:14:47.315999','2025-12-01 22:53:55.000000',NULL,1,1),
(4,'KODOM Piyabalo','Transformation des boues de vidanges en engrais organique','Modélisation par procédé micro-ondes couplé au séchage solaire des boues de vidange : cas de la ville de Kara','photo-titr-24c299a0f10.png','21frkodo-6f0e10a36b6.mp3','21kbkodo-5815ad945b.mp3','modlisatio-10f671c2e2c.pdf','2025-11-28 12:23:09.020904','2025-12-01 22:57:12.000000',NULL,1,3),
(5,'ANIKA Kodzo Hervé','Des alternatives aux produits chimiques pour combattre la teigne du choux','Extraits de cymbopogon schoenanthus (verveine d’Inde) comme alternative aux produits chimiques de synthèse dans la lutte contre la pyrale et la teigne du chou','vegetables-1c3681106d1.jpg','22franik-c1ac634155.mp3','22kbanik-cee66ba922.mp3','extraitsd-4f7aa9e61b.pdf','2025-11-28 12:57:22.638877','2025-12-01 23:01:33.000000',NULL,1,1),
(6,'AYASSOR Sougoum','Inventaire des plantes alimentaires à  Kara','Inventaire des plantes alimentaires dans les espaces verts formels et informels à Kara','ayassortit-bf2d4a10e43.jpg','23frayas-0e75a12bfc.mp3','23kbayas-dad2db8733.mp3','inventaire-55c76106aff.pdf','2025-11-28 13:05:44.906570','2025-12-02 09:29:11.000000',NULL,1,1),
(7,'BERE Abiré','Amélioration de la productivité et la protection des sols','Association culturale de la grande morelle avec des plantes pesticides telles que le basilic (Ocimum basilicum) et le Chenopodium ambrosoides pour l’amélioration de la productivité et la protection des sols','beretireim-be3710010615.jpg','24frbere-f5910a5bb4b.mp3','24kbbere-39bd901874.mp3','scriptfra-10b66bd9aa2.pdf','2025-11-28 13:15:17.877711','2025-12-02 09:46:38.000000',NULL,1,2),
(8,'AKPE Méba Grace ','KINI GNIM (Biopesticide Neem)','Enjeux et facteurs incitatifs de l’adoption des biopesticides dans la communauté de Lama Saoudè','1akpetit-10110f67bb22.png','1frgrc-10fd41483d3.mp3','1kbgrc-6cc15d3ff4.mp3','akperappo-4a5abb9b26.pdf','2025-11-28 18:20:40.516546','2025-12-01 22:39:02.000000',NULL,1,1),
(9,'AMANA Aninam','Les sols pauvres sont combattus : Kpɛɛɖɩŋ huɖe','Effets de l’engrais liquide bio sur la productivité des cultures','2amaname-d0d81bbc18.jpg','2framana-956514f7010.mp3','2kbamana-a106ac346a9.mp3','amanarapp-2ec2421c2a.pdf','2025-11-30 13:57:35.610606','2025-12-01 22:41:12.000000',NULL,1,2),
(10,'BAGOUDJARE Khaleb','Méthodes de remise en état des sols','Pratiques endogènes de restauration des sols dans le village de Tchitchao ','3bagoudja-7a15e92d2d.jpg','3frkaleb-982461e7bf.mp3','3kbkaleb-dbd8bd9abe.mp3','bagoudjare-95104c71ce3.pdf','2025-11-30 14:05:13.613479','2025-12-01 22:43:50.000000',NULL,1,2),
(11,'BERE Abiré','Déchets agricoles transformés en biochar','Utilisation du biochar comme solution durable pour la gestion des déchets agricoles : Implications pour le maraîchage','4beretit-86c23bb7a4.jpg','4frabir-fc914dc3aa.mp3','4kbabir-df3ced7e43.mp3','rapportut-c62c5ba5de.pdf','2025-11-30 14:13:04.502426','2025-12-02 09:49:59.000000',NULL,1,2),
(12,'BONE Bontchére','Qu\'attend-on d\'un conseiller numérique?','Analyse SWOT de E-Agriconseils de l’Institut de\r\nConseils et Appui Technique dans la communauté de Tchitchao au Togo','5bonetit-8950b75496.jpg','5frbone-c7410b98215.mp3','5kbbone-826c36106d7.mp3','bonerappo-10625ca92c.pdf','2025-11-30 14:25:48.759390','2025-12-02 09:55:44.000000',NULL,1,3),
(13,'GNAKOU Eyou-Djambo','Le réseau d\'échange : information pour l\'agriculture durable','Le réseau d’échange : l’influence de l’information pour une agriculture durable','6gnakout-5ccb10583de.jpg','6frramea-a3288d03a10.mp3','6kbramea-b551c29288.mp3','gnakourap-465e5f44e5.pdf','2025-11-30 14:38:19.741251','2025-12-02 10:00:10.000000',NULL,1,3),
(14,'KADANGA Koudjoukalo','Biopesticide Neem','Perception de l’éfficacité des différents modes d’utilisation des organes de Neem dans le canton de Soumdina-Haut','7kadanga-2b7968ec17.jpg','7frphoeb-65e6467347.mp3','7kbphoeb-8c68beb0d2.mp3','kadangara-409110acea9.pdf','2025-11-30 14:41:43.810161','2025-12-02 10:06:17.000000',NULL,1,1),
(15,'KAKASSINA Fernand','Combattre les termites','Gestion durable des termites à Tchitchao','8kakassin-10f62e5e5107.png','8frferna-b80977e5ce.mp3','8kbferna-a5ab37e10e6.mp3','kakassina-cf251577f4.pdf','2025-11-30 14:46:16.071472','2025-12-02 10:08:29.000000',NULL,1,1),
(16,'KOUFAME Keziah','La méthode ZAI','Gestion efficace de l’eau à Lama Saoudè : La méthode ZAI','9koufame-06a5332cca.jpg','9frnaoun-d2867cab310.mp3','9kbnaoun-8e83ca1b84.mp3','koufamera-210274ad30a.pdf','2025-11-30 14:52:36.920947','2025-12-02 10:10:50.000000',NULL,1,2),
(17,'N\'DJOKOU David Chenyere','Pesticide bio pour protéger le Gombo','Evaluation de l’efficacité des formulations biopesticides à base des huiles essentielles de Cymbopogon schoenanthus et d’Eucalyptus globulus sur la culture du gombo dans la région de la Kara au Togo','10njoku-25ec8c3d32.png','10frgis-5a4f257772.mp3','10kbgis-484c985449.mp3','njokurap-55b490f9d4.pdf','2025-11-30 14:58:32.118222','2025-12-02 10:14:11.000000',NULL,1,1),
(18,'N\'SOUGAN Akossiwa Abigaël','Engrais naturel avec des ingrédients simples','Influence de l’innovation frugale agricole sur l’intention de production des producteurs agricoles    ','11nsouga-3d051951cc.jpg','11frabig-4c5ebcfeb4.mp3','11kbabig-e8848dca3d.mp3','nsouganr-1d11a981041.pdf','2025-11-30 15:07:42.969168','2025-12-02 10:17:21.000000',NULL,1,3),
(19,'MOUSTAKIMOU SIBABI Fanny','Engrais pour meilleur rendement d’adémè','Effet de l’engrais organique sur la production de la corète potagère (adémè)','12sibabi-03b8dc23e7.jpg','12frfann-a4bd5cd4bb.mp3','12kbfann-c2b4ba386d.mp3','sibabirap-f85baeea45.pdf','2025-11-30 15:22:04.534405','2025-12-02 10:22:47.000000',NULL,1,2),
(20,'SIMLAO Bahédanora Justine','Engrais pour plus de récoltes','Le genre et les pratiques de gestion durables des terres','13simlao-4deb3ffa3f.jpg','13frjust-6d7ef5a9e4.mp3','13kbjust-34e9faaaca.mp3','simlaorap-10d7d9fb4ea.pdf','2025-11-30 15:28:08.176650','2025-12-02 10:24:29.000000',NULL,1,2);
/*!40000 ALTER TABLE `backend_post` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-01-28 16:11:53

--
-- Table structure for table `backend_user`
--

/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE IF NOT EXISTS `backend_user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `fullname` varchar(60) DEFAULT NULL,
  `gender` varchar(60) DEFAULT NULL,
  `phone` varchar(60) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `lastConnexion` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `roleId` int DEFAULT NULL,
  `statusId` int DEFAULT NULL,
  `isContactPerson` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_phone` (`phone`),
  KEY `FK_5d9f847a0a90e6dde3ee0b166ff` (`roleId`),
  KEY `FK_747c406c80cc58f64f4447dff4e` (`statusId`),
  CONSTRAINT `FK_5d9f847a0a90e6dde3ee0b166ff` FOREIGN KEY (`roleId`) REFERENCES `backend_role` (`id`),
  CONSTRAINT `FK_747c406c80cc58f64f4447dff4e` FOREIGN KEY (`statusId`) REFERENCES `backend_user_status` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
