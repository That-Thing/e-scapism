-- MySQL dump 10.13  Distrib 8.0.30, for Linux (x86_64)
--
-- Host: localhost    Database: escapism
-- ------------------------------------------------------
-- Server version	8.0.30-0ubuntu0.22.04.1

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
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accounts` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'User ID',
  `perms` int NOT NULL COMMENT 'Permission level',
  `username` tinytext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Username of user',
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Hashed password',
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci COMMENT 'Optional email',
  `creation` bigint NOT NULL COMMENT 'Unix timestamp',
  `ip` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'IP of user',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,2,'Test','Tt8H7clbL9y8ryN4/RLYrCEsKqbjJsWcPmKb4wOdZDI=','undefined',1666811442463,'::1');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `forums`
--

DROP TABLE IF EXISTS `forums`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `forums` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID of forum',
  `text_identifier` tinytext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Text identifier (ex: test, soc, psy)',
  `creation` bigint NOT NULL COMMENT 'Unix Timestamp',
  `owner` int NOT NULL COMMENT 'ID of owner',
  `name` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Name of forum',
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Short description of forum',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `forums`
--

LOCK TABLES `forums` WRITE;
/*!40000 ALTER TABLE `forums` DISABLE KEYS */;
INSERT INTO `forums` VALUES (1,'tst',1666811972678,1,'Test','Testing forum lol');
/*!40000 ALTER TABLE `forums` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `posts` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Post ID',
  `owner` int NOT NULL COMMENT 'ID of post owner',
  `username` tinytext COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Username of post owner. ',
  `forum` int NOT NULL COMMENT 'ID of forum',
  `thread` int DEFAULT NULL COMMENT 'Thread the post belongs to; NULL if post is thread. ',
  `creation` bigint NOT NULL COMMENT 'Unix timestamp',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL COMMENT 'Content of post',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,1,'',1,NULL,1666812072180,'Test post'),(2,1,'Test',1,NULL,1666813623416,'Test again');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-10-26 15:49:30
