-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: localhost    Database: profesapp
-- ------------------------------------------------------
-- Server version	5.7.24-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `admin` (
  `idadmin` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) COLLATE utf8_bin NOT NULL,
  `mail` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(45) COLLATE utf8_bin NOT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idadmin`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comment_point`
--

DROP TABLE IF EXISTS `comment_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `comment_point` (
  `idpoint` int(11) NOT NULL AUTO_INCREMENT,
  `idcomment` int(11) NOT NULL,
  `idteacher` int(11) NOT NULL,
  `point` int(11) NOT NULL,
  `datel` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpoint`),
  KEY `idcomment_idx` (`idcomment`),
  KEY `idteacher_idx` (`idteacher`),
  CONSTRAINT `idcomment_fk_cp` FOREIGN KEY (`idcomment`) REFERENCES `resource_comment` (`idcomment`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idteacher_fk_cp` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comment_point`
--

LOCK TABLES `comment_point` WRITE;
/*!40000 ALTER TABLE `comment_point` DISABLE KEYS */;
/*!40000 ALTER TABLE `comment_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event` (
  `idevent` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `title` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `description` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `text` text COLLATE utf8_bin,
  `type` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idevent`),
  KEY `idteacher_idx` (`idteacher`),
  CONSTRAINT `idteacher_fk_e` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_comment`
--

DROP TABLE IF EXISTS `event_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event_comment` (
  `idcomment` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) DEFAULT NULL,
  `idevent` int(11) DEFAULT NULL,
  `comment` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcomment`),
  KEY `idteacher_idx` (`idteacher`),
  KEY `idevent_idx` (`idevent`),
  CONSTRAINT `idevent_fk_ec` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idteacher_fk_ec` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_comment`
--

LOCK TABLES `event_comment` WRITE;
/*!40000 ALTER TABLE `event_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event_resource`
--

DROP TABLE IF EXISTS `event_resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event_resource` (
  `idresource` int(11) NOT NULL,
  `idevent` int(11) NOT NULL,
  PRIMARY KEY (`idresource`,`idevent`),
  KEY `idevent_idx` (`idevent`),
  CONSTRAINT `idevent_fk_er` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idresource_fk_er` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event_resource`
--

LOCK TABLES `event_resource` WRITE;
/*!40000 ALTER TABLE `event_resource` DISABLE KEYS */;
/*!40000 ALTER TABLE `event_resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `file`
--

DROP TABLE IF EXISTS `file`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `file` (
  `idfile` int(11) NOT NULL AUTO_INCREMENT,
  `idresource` int(11) NOT NULL,
  `filename` char(255) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idfile`),
  KEY `idresource` (`idresource`) USING BTREE,
  CONSTRAINT `file_ibfk_1` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,1,'ambiente-toxico1-300x300.jpg');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member` (
  `idteacher` int(11) NOT NULL,
  `idevent` int(11) NOT NULL,
  `state` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`idteacher`,`idevent`),
  KEY `idevent_idx` (`idevent`),
  CONSTRAINT `idevent_fk_m` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idteacher_fk_m` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource`
--

DROP TABLE IF EXISTS `resource`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource` (
  `idresource` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `title` varchar(45) COLLATE utf8_bin NOT NULL,
  `description` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `text` text COLLATE utf8_bin,
  `frontimage` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `state` varchar(45) COLLATE utf8_bin DEFAULT 'Activo',
  PRIMARY KEY (`idresource`) USING BTREE,
  KEY `idteacher` (`idteacher`) USING BTREE,
  CONSTRAINT `resource_ibfk_1` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
INSERT INTO `resource` VALUES (1,1,'Estres laboral','desc2','2019-02-06 04:40:46','',NULL,'Activo');
/*!40000 ALTER TABLE `resource` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_comment`
--

DROP TABLE IF EXISTS `resource_comment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_comment` (
  `idcomment` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `idresource` int(11) NOT NULL,
  `comment` text COLLATE utf8_bin NOT NULL,
  `date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idcomment`),
  KEY `idteacher` (`idteacher`),
  KEY `idresource` (`idresource`),
  CONSTRAINT `resource_comment_ibfk_1` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`),
  CONSTRAINT `resource_comment_ibfk_2` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_comment`
--

LOCK TABLES `resource_comment` WRITE;
/*!40000 ALTER TABLE `resource_comment` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_comment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_point`
--

DROP TABLE IF EXISTS `resource_point`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_point` (
  `idpoint` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `idresource` int(11) NOT NULL,
  `point` int(11) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpoint`),
  KEY `idteacher_idx` (`idteacher`),
  KEY `idresource_idx` (`idresource`),
  CONSTRAINT `idresource_fk_rp` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idteacher_fk_rp` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_point`
--

LOCK TABLES `resource_point` WRITE;
/*!40000 ALTER TABLE `resource_point` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_point` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `resource_tag`
--

DROP TABLE IF EXISTS `resource_tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_tag` (
  `idresource` int(11) NOT NULL,
  `idtag` int(11) NOT NULL,
  KEY `idforeings` (`idtag`,`idresource`) USING BTREE,
  KEY `resource_tag_ibfk_1_idx` (`idresource`),
  CONSTRAINT `resource_tag_ibfk_1` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `resource_tag_ibfk_2` FOREIGN KEY (`idtag`) REFERENCES `tag` (`idtag`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_tag`
--

LOCK TABLES `resource_tag` WRITE;
/*!40000 ALTER TABLE `resource_tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `review` (
  `idresourcedad` int(11) NOT NULL,
  `idresourceson` int(11) NOT NULL,
  `idroot` int(11) DEFAULT NULL,
  PRIMARY KEY (`idresourcedad`,`idresourceson`) USING BTREE,
  KEY `idresourceson` (`idresourceson`,`idresourcedad`) USING BTREE,
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`idresourcedad`) REFERENCES `resource` (`idresource`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`idresourceson`) REFERENCES `resource` (`idresource`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tag` (
  `idtag` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(45) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idtag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
/*!40000 ALTER TABLE `tag` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `teacher` (
  `idteacher` int(11) NOT NULL AUTO_INCREMENT,
  `name` char(255) COLLATE utf8_bin DEFAULT NULL,
  `username` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `mail` varchar(45) COLLATE utf8_bin DEFAULT NOT NULL,
  `password` varchar(45) COLLATE utf8_bin NOT NULL,
  `address` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `valid` int(11) DEFAULT 1,
  `public` varchar(45) COLLATE utf8_bin DEFAULT '1',
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idteacher`),
  KEY `idteacher_idx` (`idteacher`) USING BTREE,
  UNIQUE INDEX `mail_UNIQUE` (`mail` ASC)

) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'alf','alf','alf@gmail.com','123',NULL,NULL,NULL,'2019-02-06 07:40:18');
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

-- Dump completed on 2019-02-06  4:55:46
