-- MySQL dump 10.13  Distrib 5.7.12, for Win64 (x86_64)
--
-- Host: localhost    Database: profesapp
-- ------------------------------------------------------
-- Server version	5.7.25-0ubuntu0.18.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
INSERT INTO `admin` VALUES (1,'root','observaciudadania17@gmail.com','observa2019','2019-02-14 23:52:04');
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `comment_point`
--

LOCK TABLES `comment_point` WRITE;
/*!40000 ALTER TABLE `comment_point` DISABLE KEYS */;
INSERT INTO `comment_point` VALUES (78,21,1,1,'2019-02-07 19:32:50'),(80,23,1,-1,'2019-02-07 19:42:12'),(81,24,1,-1,'2019-02-12 00:05:31'),(82,25,1,1,'2019-03-05 00:43:05'),(83,25,1,1,'2019-03-05 00:43:05'),(84,25,1,1,'2019-03-05 00:43:06');
/*!40000 ALTER TABLE `comment_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_comment`
--

LOCK TABLES `event_comment` WRITE;
/*!40000 ALTER TABLE `event_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `event_resource`
--

LOCK TABLES `event_resource` WRITE;
/*!40000 ALTER TABLE `event_resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,1,'ambiente-toxico1-300x300.jpg');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `questionary`
--

LOCK TABLES `questionary` WRITE;
/*!40000 ALTER TABLE `questionary` DISABLE KEYS */;
INSERT INTO `questionary` VALUES (7,13,'¿Cuales son sus objetivos personales?','1','2019-02-18 22:42:01'),(8,13,'¿A qué se dedica?','2','2019-02-18 22:42:01'),(9,13,'¿Porqué desea utilizar esta plataforma?','3','2019-02-18 22:42:01');
/*!40000 ALTER TABLE `questionary` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
INSERT INTO `resource` VALUES (1,1,'Estres laboral','desc2','2019-02-06 04:40:46','',NULL,'Activo');
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resource_comment`
--

LOCK TABLES `resource_comment` WRITE;
/*!40000 ALTER TABLE `resource_comment` DISABLE KEYS */;
INSERT INTO `resource_comment` VALUES (21,1,1,'Hola','2019-02-07 19:32:46'),(23,1,1,'prueba','2019-02-07 19:42:10'),(24,1,1,'hola2','2019-02-12 00:05:25'),(25,1,1,'me gustan los completos\n','2019-03-05 00:43:02');
/*!40000 ALTER TABLE `resource_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resource_point`
--

LOCK TABLES `resource_point` WRITE;
/*!40000 ALTER TABLE `resource_point` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `resource_tag`
--

LOCK TABLES `resource_tag` WRITE;
/*!40000 ALTER TABLE `resource_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'alcachofa4','asantiba','canespfam@gmail.com','123',NULL,'122',1,NULL,NULL,'2019-02-16 11:02:48'),(13,NULL,NULL,'alexis.santibanez.14@gmail.com',NULL,'19.261.349-5',NULL,0,NULL,NULL,'2019-02-18 22:42:01'),(14,'Macarena Orellana','Macarena','coordinacion@observaciudadania.org','macarena123','177408239','los jazmines ',1,'1,1,0,0,0','1991-01-08 00:00:00','2019-03-12 17:01:20'),(15,NULL,'Margarita','operaciones1@observaciudadania.org','margarita123',NULL,NULL,1,NULL,NULL,'2019-03-12 17:01:43'),(16,NULL,'HerediHervia','heredi.hervia@gmail.com','here123',NULL,NULL,1,NULL,NULL,'2019-03-12 17:18:07');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-15 19:37:19
