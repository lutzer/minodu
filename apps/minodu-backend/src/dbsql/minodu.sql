-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:8889
-- Generation Time: Nov 25, 2025 at 12:08 PM
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
-- Table structure for table `backend_configuration`
--

CREATE TABLE `backend_configuration` (
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
-- Dumping data for table `backend_configuration`
--

INSERT INTO `backend_configuration` (`id`, `community_name`, `adresse`, `location`, `whatsapp_link`, `station_link`, `created_at`, `updated_at`, `community_introduction`) VALUES
(1, 'Communauté des agriculteurs de Tomdè', 'Kara, Tomdè', '0.00,0.00', '', '', '2025-04-21 14:50:54.606424', '2025-05-19 21:37:28.000000', 'Fondée sur des valeurs de coopération et d\'innovation, notre communauté rassemble des producteurs passionnés, des experts agronomes et des partenaires engagés pour soutenir le développement agricole local. À travers des formations, des échanges techniques et des projets collectifs, nous œuvrons pour améliorer les rendements, préserver nos terres et renforcer la sécurité alimentaire.\n\nEnsemble, cultivons l\'avenir de Tomdè avec fierté et détermination !');

-- --------------------------------------------------------

--
-- Table structure for table `backend_post_category`
--

CREATE TABLE `backend_post_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `backend_post_category`
--

INSERT INTO `backend_post_category` (`id`, `name`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'PROTECTION DE PLANTS', '', '2025-04-21 15:34:46.717247', '2025-08-05 20:57:00.000000', NULL),
(2, 'SANTÉ ET GESTION DU SOL', '', '2025-04-21 15:35:52.018383', '2025-04-21 15:36:51.171423', NULL),
(3, 'AUTRES', '', '2025-04-21 15:36:23.150296', '2025-04-21 15:36:23.150296', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `backend_product_category`
--

CREATE TABLE `backend_product_category` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `backend_product_category`
--

INSERT INTO `backend_product_category` (`id`, `name`, `image`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'CÉRÉALES', '', '2025-05-18 23:58:11.614271', '2025-08-05 20:54:38.000000', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `backend_role`
--

CREATE TABLE `backend_role` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `backend_role`
--

INSERT INTO `backend_role` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ADMIN', '2025-04-21 14:50:54.601289', '2025-04-21 14:50:54.601289', NULL),
(2, 'USER', '2025-04-21 14:50:54.608930', '2025-04-21 14:50:54.608930', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `backend_user`
--

CREATE TABLE `backend_user` (
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
-- Dumping data for table `backend_user`
--

INSERT INTO `backend_user` (`id`, `phone`, `password`, `lastConnexion`, `createdAt`, `updatedAt`, `deletedAt`, `roleId`, `statusId`, `fullname`, `gender`) VALUES
(1, '90000000', '$2a$10$mK3yWiE5oI2UKmfgDpN3o.vf5GrCfcxe/CkwFEWHKSl7jRrhojn9m', '2025-08-11 12:29:10', '2025-04-21 14:50:54.718450', '2025-08-11 12:30:30.000000', NULL, 1, 1, 'Seti AF', 'Male');

-- --------------------------------------------------------

--
-- Table structure for table `backend_user_status`
--

CREATE TABLE `backend_user_status` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `createdAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updatedAt` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deletedAt` timestamp(6) NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `backend_user_status`
--

INSERT INTO `backend_user_status` (`id`, `name`, `createdAt`, `updatedAt`, `deletedAt`) VALUES
(1, 'ACTIVE', '2025-04-21 14:50:54.588214', '2025-04-21 14:50:54.588214', NULL),
(2, 'BLOCKED', '2025-04-21 14:50:54.602724', '2025-04-21 14:50:54.602724', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `backend_configuration`
--
ALTER TABLE `backend_configuration`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `backend_post_category`
--
ALTER TABLE `backend_post_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_post_category` (`name`);

--
-- Indexes for table `backend_product_category`
--
ALTER TABLE `backend_product_category`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_product_category` (`name`);

--
-- Indexes for table `backend_role`
--
ALTER TABLE `backend_role`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_role` (`name`);

--
-- Indexes for table `backend_user`
--
ALTER TABLE `backend_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_phone` (`phone`),
  ADD KEY `FK_5d9f847a0a90e6dde3ee0b166ff` (`roleId`),
  ADD KEY `FK_747c406c80cc58f64f4447dff4e` (`statusId`);

--
-- Indexes for table `backend_user_status`
--
ALTER TABLE `backend_user_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uniq_userStatus` (`name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `backend_post_category`
--
ALTER TABLE `backend_post_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `backend_product_category`
--
ALTER TABLE `backend_product_category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `backend_role`
--
ALTER TABLE `backend_role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `backend_user`
--
ALTER TABLE `backend_user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `backend_user_status`
--
ALTER TABLE `backend_user_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `backend_user`
--
ALTER TABLE `backend_user`
  ADD CONSTRAINT `FK_5d9f847a0a90e6dde3ee0b166ff` FOREIGN KEY (`roleId`) REFERENCES `backend_role` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `FK_747c406c80cc58f64f4447dff4e` FOREIGN KEY (`statusId`) REFERENCES `backend_user_status` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
