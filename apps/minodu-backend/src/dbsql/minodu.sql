-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 01, 2025 at 02:57 PM
-- Server version: 5.7.39
-- PHP Version: 7.3.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `minodu`
--

-- --------------------------------------------------------

--
-- Table structure for table `configuration`
--

CREATE TABLE `configuration` (
  `id` int(11) NOT NULL,
  `community_name` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `whatsapp_link` varchar(255) DEFAULT NULL,
  `station_link` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `community_introduction` varchar(1000) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `configuration`
--

INSERT IGNORE INTO `configuration` (`id`, `community_name`, `adresse`, `location`, `whatsapp_link`, `station_link`, `created_at`, `updated_at`, `community_introduction`) VALUES
(1, 'Communauté des agriculteurs de Tomdè', 'Kara, Tomdè', '0.00,0.00', '', '', '2025-04-21 14:50:54.606424', '2025-05-19 21:37:28.000000', 'Fondée sur des valeurs de coopération et d\'innovation, notre communauté rassemble des producteurs passionnés, des experts agronomes et des partenaires engagés pour soutenir le développement agricole local. À travers des formations, des échanges techniques et des projets collectifs, nous œuvrons pour améliorer les rendements, préserver nos terres et renforcer la sécurité alimentaire.\n\nEnsemble, cultivons l\'avenir de Tomdè avec fierté et détermination !');

-- --------------------------------------------------------

--
-- Table structure for table `farmer`
--

CREATE TABLE `farmer` (
  `id` int(11) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `gender` varchar(255) NOT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `partner`
--

CREATE TABLE `partner` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `adresse` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `post`
--

CREATE TABLE `post` (
  `id` int(11) NOT NULL,
  `author` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `image` varchar(255) DEFAULT NULL,
  `attachment` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `userId` int(11) DEFAULT NULL,
  `postCategoryId` int(11) DEFAULT NULL,
  `attachmentKb` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `post`
--

INSERT IGNORE INTO `post` (`id`, `author`, `title`, `description`, `image`, `attachment`, `createdAt`, `updatedAt`, `deletedAt`, `userId`, `postCategoryId`, `attachmentKb`) VALUES
(1, 'AKPE Mèba Grasse', 'KINI GNIM', 'Enjeux et facteurs incitatifs de l’adoption des biopesticides dans la communauté de Lama Saoudè', '1akpetit-5b415358c10.webp', '1frgra-9e1f86f7c3.mp3', '2025-04-23 01:13:01.926123', '2025-08-05 22:30:04.000000', NULL, 1, 1, '1kbgra-6f10ff417f7.mp3'),
(2, 'AMANA Aninam', 'Les sols pauvres sont combattus', 'Effets de l’engrais liquide bio sur la productivité des cultures', '2amaname-45c7ad78f5.webp', '2framana-3f783a7e18.mp3', '2025-04-23 01:39:13.616387', '2025-04-23 01:39:43.001334', NULL, 1, 2, '2kbamana-3258e4474e.mp3'),
(3, 'BAGOUDJARE Kalèb', 'Métodes de remise en état des sols', 'Pratiques endogènes de restauration des sols dans le village de Tchitchao', '3bagoudja-d52212dfe6.webp', '3frkaleb-d1b41027cee.mp3', '2025-04-23 14:09:52.271026', '2025-04-23 14:09:52.271026', NULL, 1, 2, '3kbkaleb-7d710106a4d9.mp3'),
(4, 'BERE Abiré', 'Déchets agricoles transformés en biochar', 'Utilisation du biochar comme solution durable pour la gestion des déchets agricoles : Implications pour le maraîchage', '4beretit-ed377d1ec7.webp', '4frabire-78dc18cd44.mp3', '2025-04-23 14:13:13.319535', '2025-04-23 14:13:13.319535', NULL, 1, 2, '4kbabire-f42060e142.mp3'),
(5, 'BONE Bontchére', 'Qu\'attend-on d\'un conseiller numérique?', 'Analyse SWOT de E-Agriconseils de l’Institut de Conseils et Appui Technique dans la communauté de Tchitchao au Togo', '5bonetit-24ec0f1195.webp', '5frbone-4428c862b7.mp3', '2025-04-23 14:19:23.431552', '2025-04-23 14:19:23.431552', NULL, 1, 3, '5kbbone-285efae715.mp3'),
(6, 'GNAKOU Eyou-Djambo Akilame', 'Le réseau d\'échange : information pour l\'agriculture durable', 'Le réseau d’échange : l’influence de l’information pour une agriculture durable', '6gnakout-a1104f1045ac.webp', '6frramea-eb1784e996.mp3', '2025-04-23 14:22:03.427067', '2025-04-23 14:22:03.427067', NULL, 1, 3, '6kbramea-781dfbd1d1.mp3'),
(7, 'KADANGA Koudjoukalo Phoebe', 'Biopesticide Neem', 'Perception de l’éfficacité des différents modes d’utilisation des organes de Neem dans le canton de Soumdina-Haut', '7kadanga-d7105421c57.webp', '7frphoeb-291a2cfd6c.mp3', '2025-04-23 14:34:41.543844', '2025-04-23 14:34:41.543844', NULL, 1, 1, '7kbphoeb-eecefde431.mp3'),
(8, 'KAKASSINA Fernand', 'Combattre les termites', 'Gestion durable des termites à Tchitchao', '8kakassin-dad1aed5cb.webp', '8frferna-b178c2c1d9.mp3', '2025-04-23 14:37:23.674028', '2025-04-23 14:37:23.674028', NULL, 1, 1, '8kbferna-9e78b3efc7.mp3'),
(9, 'KOUFAME KEZIAH Naoune', 'La méthode ZAI', 'Gestion efficace de l’eau à Lama Saoudè : La méthode ZAI', '9koufame-18b94239a0.webp', '9frnaoun-c6d1a51017e.mp3', '2025-04-23 14:40:34.198693', '2025-04-23 14:40:34.198693', NULL, 1, 2, '9kbnaoun-672abda248.mp3'),
(10, 'N\'JOKU David Chenyere Gisèle', 'Pesticide bio pour protéger le Gombo', 'Evaluation de l’efficacité des formulations biopesticides à base des huiles essentielles de Cymbopogon schoenanthus et d’Eucalyptus globulus sur la culture du gombo dans la région de la Kara au Togo', '10njokut-9fdce009f10.webp', '10frgise-4f9ec69a77.mp3', '2025-04-23 14:49:55.507941', '2025-04-23 14:49:55.507941', NULL, 1, 1, '10kbgise-af314f8ebd.mp3'),
(11, 'N’SOUGAN Akossiwa Abigaîl', 'Engrais naturel avec des ingrédients simples', 'Influence de l’innovation frugale agricole sur l’intention de production des producteurs agricoles', '11nsougan-429ff8d445.webp', '11frabig-352e45bdbc.mp3', '2025-04-23 14:52:29.964472', '2025-04-23 14:52:29.964472', NULL, 1, 2, '11kbabig-5eaab8cf10d.mp3'),
(12, 'SIBABI Moustakimou Fanny', 'Engrais pour un meilleur rendement d’adémè', 'Effet de l’engrais organique sur la production de la corète potagère (adémè)', '12sibabi-15e774cec9.webp', '12frfann-432ed2780f.mp3', '2025-04-23 14:56:07.222085', '2025-04-23 14:56:07.222085', NULL, 1, 2, '12kbfann-bb7f11e40b.mp3'),
(13, 'SIMLAO Bahédanora Justine', 'Engrais pour plus de récoltes', 'Le genre et les pratiques de gestion durables des terres', '13simlao-da3fcc08ae.webp', '13frjust-ae51057f245.mp3', '2025-04-23 14:59:39.584622', '2025-04-23 14:59:39.584622', NULL, 1, 2, '13kbjust-10959fad5f1.mp3');

-- --------------------------------------------------------

--
-- Table structure for table `posts_resources`
--

CREATE TABLE `posts_resources` (
  `postId` int(11) NOT NULL,
  `resourceId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `posts_tags`
--

CREATE TABLE `posts_tags` (
  `postId` int(11) NOT NULL,
  `tagId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `posts_tags`
--

INSERT IGNORE INTO `posts_tags` (`postId`, `tagId`) VALUES
(1, 1),
(1, 26),
(2, 27),
(3, 28),
(3, 29),
(3, 30),
(4, 31),
(4, 32),
(5, 33),
(5, 34),
(6, 35),
(6, 36),
(7, 1),
(7, 37),
(8, 38),
(8, 39),
(9, 40),
(9, 41),
(9, 42),
(10, 1),
(10, 43),
(10, 44),
(11, 45),
(12, 46),
(12, 47),
(13, 28),
(13, 48),
(13, 49);

-- --------------------------------------------------------

--
-- Table structure for table `post_category`
--

CREATE TABLE `post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `post_category`
--

INSERT IGNORE INTO `post_category` (`id`, `name`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'PROTECTION DE PLANTS', '', '2025-04-21 15:34:46.717247', '2025-08-05 20:57:00.000000', NULL),
(2, 'SANTÉ ET GESTION DU SOL', '', '2025-04-21 15:35:52.018383', '2025-04-21 15:36:51.171423', NULL),
(3, 'AUTRES', '', '2025-04-21 15:36:23.150296', '2025-04-21 15:36:23.150296', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `post_resource`
--

CREATE TABLE `post_resource` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `post_tag`
--

CREATE TABLE `post_tag` (
  `id` int(11) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `post_tag`
--

INSERT IGNORE INTO `post_tag` (`id`, `name`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'TAG1', 'schadlinge-2ec118c325.webp', '2025-04-22 11:31:09.383319', '2025-04-22 11:47:00.150501', NULL),
(26, 'TAG2', 'pestizid-be1cc80806.webp', '2025-04-22 11:47:17.992704', '2025-04-22 11:47:17.992704', NULL),
(27, 'TAG3', 'dunger-310a1d010d2d.webp', '2025-04-22 11:47:47.867404', '2025-04-22 11:47:47.867404', NULL),
(28, 'TAG4', 'dungen-3f3f48a1084.webp', '2025-04-22 11:48:00.426494', '2025-04-22 11:48:00.426494', NULL),
(29, 'TAG5', 'kuh-82b4ff5926.webp', '2025-04-22 11:48:11.441925', '2025-04-22 11:48:11.441925', NULL),
(30, 'TAG6', 'partnersch-870f0871f1.webp', '2025-04-22 11:48:23.424303', '2025-04-22 11:48:23.424303', NULL),
(31, 'TAG7', 'kohle-5b58b92e9f.webp', '2025-04-22 11:48:35.808133', '2025-04-22 11:48:35.808133', NULL),
(32, 'TAG8', 'zersetzung-97ecb10de69.webp', '2025-04-22 11:48:52.973055', '2025-04-22 11:48:52.973055', NULL),
(33, 'TAG9', 'eagriconse-fac3102f7e1.webp', '2025-04-22 11:49:03.596501', '2025-04-22 11:49:03.596501', NULL),
(34, 'TAG10', 'digital-6d78d9e739.webp', '2025-04-22 11:49:14.518545', '2025-04-22 11:49:14.518545', NULL),
(35, 'TAG11', 'kommunikat-5910fc4f3104.webp', '2025-04-22 11:49:23.616425', '2025-04-22 11:49:23.616425', NULL),
(36, 'TAG12', 'kommunikat-b4210c51af2.webp', '2025-04-22 11:49:34.697522', '2025-04-22 11:49:34.697522', NULL),
(37, 'TAG13', 'neem-21034e889dc.webp', '2025-04-22 11:49:52.219108', '2025-04-22 11:49:52.219108', NULL),
(38, 'TAG14', 'termiten-e9664e5fe2.webp', '2025-04-22 11:50:02.716375', '2025-04-22 11:50:02.716375', NULL),
(39, 'TAG15', 'termiten2-9caaf935109.webp', '2025-04-22 11:50:13.986030', '2025-04-22 11:50:13.986030', NULL),
(40, 'TAG16', 'anlage-62cadbaa5b.webp', '2025-04-22 11:50:25.336917', '2025-04-22 11:50:25.336917', NULL),
(41, 'TAG17', 'wasser-db10af937e9.webp', '2025-04-22 11:50:41.339466', '2025-04-22 11:50:41.339466', NULL),
(42, 'TAG18', 'lochgrabe-7679cb2063.webp', '2025-04-22 11:50:49.312718', '2025-04-22 11:50:49.312718', NULL),
(43, 'TAG19', 'okra-a18ba8723f.webp', '2025-04-22 11:50:56.596832', '2025-04-22 11:50:56.596832', NULL),
(44, 'TAG20', 'produitna-748b336f26.webp', '2025-04-22 11:51:04.848324', '2025-04-22 11:51:04.848324', NULL),
(45, 'TAG21', 'innovation-5dd4fd9444.webp', '2025-04-22 11:51:13.348831', '2025-04-22 11:51:13.348831', NULL),
(46, 'TAG22', 'dnger-87e2c68421.webp', '2025-04-22 11:51:20.951976', '2025-04-22 11:51:20.951976', NULL),
(47, 'TAG23', 'bltterade-e1c86cf842.webp', '2025-04-22 11:51:30.299700', '2025-04-22 11:51:30.299700', NULL),
(48, 'TAG24', 'mischkultu-c76bd381fd.webp', '2025-04-22 11:51:37.777922', '2025-04-22 11:51:37.777922', NULL),
(49, 'TAG25', 'genre-645ad3d4be.webp', '2025-04-22 11:51:46.411792', '2025-04-22 11:51:46.411792', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `audio_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` timestamp(6) NULL DEFAULT NULL,
  `productCategoryId` int(11) DEFAULT NULL,
  `sales_unit` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product`
--

INSERT IGNORE INTO `product` (`id`, `name`, `image`, `description`, `price`, `audio_url`, `created_at`, `updated_at`, `deleted_at`, `productCategoryId`, `sales_unit`) VALUES
(1, 'Le maïs', 'corn-ab76956510.jpg', 'Le maïs est une plante herbacée tropicale annuelle de la famille des Poacées, largement cultivée comme céréale pour ses grains riches en amidon, mais aussi comme plante fourragère. Le terme désigne aussi le grain de maïs lui-même.', 2000, NULL, '2025-05-19 11:37:10.696321', '2025-08-05 20:46:08.000000', NULL, 1, 'sac'),
(2, 'Le soja', 'images-1-e92ccd27e3.jpeg', 'Le soja, est une espèce de plantes à fleurs de la famille des légumineuses. C\'est une plante herbacée originaire d\'Asie orientale. Le soja cultivé Glycine max a accumulé une diversité génétique prodigieuse depuis sa domestication.', 20000, NULL, '2025-05-20 14:37:43.322685', '2025-05-20 14:37:43.322685', NULL, 1, 'Sac'),
(3, 'Le haricot', '7cef09d0-4-995a562b23.webp', 'Le haricot, ou haricot commun, est une espèce de plantes à fleurs annuelles de la famille des Fabaceae, du genre Phaseolus, couramment cultivée comme légume. On en consomme soit le fruit, soit les graines, riches en protéines.', 10000, NULL, '2025-05-20 15:43:35.635335', '2025-05-20 15:43:35.635335', NULL, 1, 'Bassine');

-- --------------------------------------------------------

--
-- Table structure for table `product_category`
--

CREATE TABLE `product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `product_category`
--

INSERT IGNORE INTO `product_category` (`id`, `name`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'CÉRÉALES', '', '2025-05-18 23:58:11.614271', '2025-08-05 20:54:38.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `product_demand`
--

CREATE TABLE `product_demand` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `deadline` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `partnerId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `product_offer`
--

CREATE TABLE `product_offer` (
  `id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `userId` int(11) NOT NULL,
  `productId` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `role`
--

INSERT IGNORE INTO `role` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ADMIN', '2025-04-21 14:50:54.601289', '2025-04-21 14:50:54.601289', NULL),
(2, 'USER', '2025-04-21 14:50:54.608930', '2025-04-21 14:50:54.608930', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `session`
--

CREATE TABLE `session` (
  `id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `validUntil` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `finishedAt` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `session`
--

INSERT IGNORE INTO `session` (`id`, `token`, `validUntil`, `finishedAt`, `createdAt`, `userId`) VALUES
(26, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicGhvbmUiOiI5MDAwMDAwMCIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1NDkxNTM1MCwiZXhwIjoxNzU1MDg4MTUwfQ.S_ig23j38y9SZOfUDe9BlQZAYCrxrolNkXn_6BzP8FQ', '2025-08-13 12:29:10', '2025-08-13 12:29:10', '2025-08-11 12:29:10.447489', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `lastConnexion` timestamp NULL DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL,
  `statusId` int(11) DEFAULT NULL,
  `fullname` varchar(255) DEFAULT NULL,
  `gender` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user`
--

INSERT IGNORE INTO `user` (`id`, `phone`, `password`, `lastConnexion`, `createdAt`, `updatedAt`, `deletedAt`, `roleId`, `statusId`, `fullname`, `gender`) VALUES
(1, '90000000', '$2a$10$mK3yWiE5oI2UKmfgDpN3o.vf5GrCfcxe/CkwFEWHKSl7jRrhojn9m', '2025-08-11 12:29:10', '2025-04-21 14:50:54.718450', '2025-08-11 12:30:30.000000', NULL, 1, 1, 'Seti AF', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `user_status`
--

CREATE TABLE `user_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `user_status`
--

INSERT IGNORE INTO `user_status` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ACTIVE', '2025-04-21 14:50:54.588214', '2025-04-21 14:50:54.588214', NULL),
(2, 'BLOCKED', '2025-04-21 14:50:54.602724', '2025-04-21 14:50:54.602724', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `weather`
--

CREATE TABLE `weather` (
  `id` int(11) NOT NULL,
  `pressure` float DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `temperature1` float DEFAULT NULL,
  `humidity1` float DEFAULT NULL,
  `luminosity` float DEFAULT NULL,
  `ambient` float DEFAULT NULL,
  `temperature` int(11) DEFAULT NULL,
  `humidity` int(11) DEFAULT NULL,
  `co` int(11) DEFAULT NULL,
  `no2` int(11) DEFAULT NULL,
  `description` varchar(1000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `weather`
--

INSERT IGNORE INTO `weather` (`id`, `pressure`, `createdAt`, `temperature1`, `humidity1`, `luminosity`, `ambient`, `temperature`, `humidity`, `co`, `no2`, `description`) VALUES
(1, 1013.25, '2025-05-19 14:20:24.555004', 21.8, 47.2, NULL, 215, 22, 45, 0, 12, NULL),
(2, 1013.25, '2025-05-19 14:23:50.048167', 21.8, 47.2, 320.5, 215, 22, 45, 0, 12, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `configuration`
--
ALTER TABLE `configuration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `farmer`
--
ALTER TABLE `farmer`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `REL_28f886de43e41be7d29b08bd9d` (`userId`);

--
-- Indexes for table `partner`
--
ALTER TABLE `partner`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `partner` (`name`);

--
-- Indexes for table `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_5c1cf55c308037b5aca1038a131` (`userId`),
  ADD KEY `FK_cbeb49c5aeb20144c612817c0cc` (`postCategoryId`);

--
-- Indexes for table `posts_resources`
--
ALTER TABLE `posts_resources`
  ADD PRIMARY KEY (`postId`,`resourceId`),
  ADD KEY `IDX_41e47cdfc31b2d910b780ac5b5` (`postId`),
  ADD KEY `IDX_ac71f666ea665b7d2e79f31084` (`resourceId`);

--
-- Indexes for table `posts_tags`
--
ALTER TABLE `posts_tags`
  ADD PRIMARY KEY (`postId`,`tagId`),
  ADD KEY `IDX_8001e7fb6ff37581be869693c0` (`postId`),
  ADD KEY `IDX_46d37fa943bb7d233d5987877e` (`tagId`);

--
-- Indexes for table `post_category`
--
ALTER TABLE `post_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_post_category` (`name`);

--
-- Indexes for table `post_resource`
--
ALTER TABLE `post_resource`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_post_resource` (`name`);

--
-- Indexes for table `post_tag`
--
ALTER TABLE `post_tag`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_post_tag` (`name`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_product` (`name`),
  ADD KEY `FK_618194d24a7ea86a165d7ec628e` (`productCategoryId`);

--
-- Indexes for table `product_category`
--
ALTER TABLE `product_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_product_category` (`name`);

--
-- Indexes for table `product_demand`
--
ALTER TABLE `product_demand`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_d2f92a8efc301d099da8991f62a` (`partnerId`),
  ADD KEY `FK_bcbcff00ec58ca9c0b51d3f5ab2` (`productId`);

--
-- Indexes for table `product_offer`
--
ALTER TABLE `product_offer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_ba3c9385566d0d0104b811ab8ce` (`userId`),
  ADD KEY `FK_f4e2b105e4765d6a56cf0ef8592` (`productId`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_role` (`name`);

--
-- Indexes for table `session`
--
ALTER TABLE `session`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK_3d2f174ef04fb312fdebd0ddc53` (`userId`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_phone` (`phone`),
  ADD KEY `FK_c28e52f758e7bbc53828db92194` (`roleId`),
  ADD KEY `FK_dc18daa696860586ba4667a9d31` (`statusId`);

--
-- Indexes for table `user_status`
--
ALTER TABLE `user_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_userStatus` (`name`);

--
-- Indexes for table `weather`
--
ALTER TABLE `weather`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `farmer`
--
ALTER TABLE `farmer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `partner`
--
ALTER TABLE `partner`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post`
--
ALTER TABLE `post`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `post_category`
--
ALTER TABLE `post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `post_resource`
--
ALTER TABLE `post_resource`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `post_tag`
--
ALTER TABLE `post_tag`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `product_category`
--
ALTER TABLE `product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `product_demand`
--
ALTER TABLE `product_demand`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_offer`
--
ALTER TABLE `product_offer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `session`
--
ALTER TABLE `session`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_status`
--
ALTER TABLE `user_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `weather`
--
ALTER TABLE `weather`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `farmer`
--
ALTER TABLE `farmer`
  ADD CONSTRAINT `FK_28f886de43e41be7d29b08bd9d7` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `FK_5c1cf55c308037b5aca1038a131` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_cbeb49c5aeb20144c612817c0cc` FOREIGN KEY (`postCategoryId`) REFERENCES `post_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `posts_resources`
--
ALTER TABLE `posts_resources`
  ADD CONSTRAINT `FK_41e47cdfc31b2d910b780ac5b51` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_ac71f666ea665b7d2e79f310841` FOREIGN KEY (`resourceId`) REFERENCES `post_resource` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `posts_tags`
--
ALTER TABLE `posts_tags`
  ADD CONSTRAINT `FK_46d37fa943bb7d233d5987877ec` FOREIGN KEY (`tagId`) REFERENCES `post_tag` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_8001e7fb6ff37581be869693c0c` FOREIGN KEY (`postId`) REFERENCES `post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `product`
--
ALTER TABLE `product`
  ADD CONSTRAINT `FK_618194d24a7ea86a165d7ec628e` FOREIGN KEY (`productCategoryId`) REFERENCES `product_category` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `product_demand`
--
ALTER TABLE `product_demand`
  ADD CONSTRAINT `FK_bcbcff00ec58ca9c0b51d3f5ab2` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_d2f92a8efc301d099da8991f62a` FOREIGN KEY (`partnerId`) REFERENCES `partner` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `product_offer`
--
ALTER TABLE `product_offer`
  ADD CONSTRAINT `FK_ba3c9385566d0d0104b811ab8ce` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_f4e2b105e4765d6a56cf0ef8592` FOREIGN KEY (`productId`) REFERENCES `product` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

--
-- Constraints for table `session`
--
ALTER TABLE `session`
  ADD CONSTRAINT `FK_3d2f174ef04fb312fdebd0ddc53` FOREIGN KEY (`userId`) REFERENCES `user` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `FK_c28e52f758e7bbc53828db92194` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_dc18daa696860586ba4667a9d31` FOREIGN KEY (`statusId`) REFERENCES `user_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;