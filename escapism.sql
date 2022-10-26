-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               10.4.11-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for escapism
CREATE DATABASE IF NOT EXISTS `escapism` /*!40100 DEFAULT CHARACTER SET utf8mb4 */;
USE `escapism`;

-- Dumping structure for table escapism.accounts
CREATE TABLE IF NOT EXISTS `accounts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `perms` int(11) NOT NULL COMMENT 'Permission level',
  `username` tinytext NOT NULL COMMENT 'Username of user',
  `password` text NOT NULL COMMENT 'Hashed password',
  `email` text DEFAULT NULL COMMENT 'Optional email',
  `creation` int(11) NOT NULL COMMENT 'Unix timestamp',
  `ip` text NOT NULL COMMENT 'IP of user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table escapism.forums
CREATE TABLE IF NOT EXISTS `forums` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'ID of forum',
  `text_identifier` tinytext NOT NULL COMMENT 'Text identifier (ex: test, soc, psy)',
  `creation` int(11) NOT NULL COMMENT 'Unix Timestamp',
  `owner` int(11) NOT NULL COMMENT 'ID of owner',
  `name` text NOT NULL COMMENT 'Name of forum',
  `description` text NOT NULL COMMENT 'Short description of forum',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

-- Dumping structure for table escapism.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Post ID',
  `owner` int(11) NOT NULL COMMENT 'ID of post owner',
  `forum` int(11) NOT NULL COMMENT 'ID of forum',
  `creation` int(11) NOT NULL COMMENT 'Unix timestamp',
  `content` longtext NOT NULL COMMENT 'Content of post',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Data exporting was unselected.

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
