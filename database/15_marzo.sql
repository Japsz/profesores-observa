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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpoint`),
  KEY `idcomment_idx` (`idcomment`),
  KEY `fk_idteacher_cp_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_cp` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idcomment_fk_cp` FOREIGN KEY (`idcomment`) REFERENCES `resource_comment` (`idcomment`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=85 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `start` datetime NULL,
  `end` datetime NULL,
  `idgoogle` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`idevent`),
  KEY `fk_idteacher_ev_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_ev` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  KEY `idevent_idx` (`idevent`),
  KEY `fk_idteacher_ec_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_ec` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idevent_fk_ec` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `institution`
--

DROP TABLE IF EXISTS `institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `institution` (
  `idinstitution` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8_bin NOT NULL,
  `address` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`idinstitution`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  CONSTRAINT `fk_idteacher_mb` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idevent_fk_m` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `questionary`
--

DROP TABLE IF EXISTS `questionary`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `questionary` (
  `idquestionary` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `question` varchar(45) DEFAULT NULL,
  `answer` varchar(200) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idquestionary`),
  KEY `idteacher_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_quest` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  KEY `fk_idteacher_rec_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_rec` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  KEY `idresource` (`idresource`),
  KEY `fk_idteacher_rc_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_rc` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `resource_comment_ibfk_2` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `resource_score`
--

DROP TABLE IF EXISTS `resource_score`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `resource_score` (
  `idscore` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) NOT NULL,
  `idresource` int(11) NOT NULL,
  `score` int(11) DEFAULT NULL,
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idscore`),
  KEY `idresource_rs_idx` (`idresource`),
  KEY `fk_idteacher_rs_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_rs` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idresource_fk_rs` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
-- Table structure for table `tag`
--

DROP TABLE IF EXISTS `tag`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `tag` (
  `idtag` int(11) NOT NULL AUTO_INCREMENT,
  `tag` varchar(45) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idtag`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

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
  `mail` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `rut` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `address` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `perfil_image` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `valid` int(11) DEFAULT NULL,
  `public` varchar(45) COLLATE utf8_bin DEFAULT '1,1,0,0,1',
  `birth_date` datetime DEFAULT NULL,
  `date_gen` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idteacher`),
  KEY `idteacher_idx` (`idteacher`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teacher_institution`
--

DROP TABLE IF EXISTS `teacher_institution`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `teacher_institution` (
  `idteacher` int(11) NOT NULL,
  `idinstitution` int(11) NOT NULL,
  PRIMARY KEY (`idteacher`,`idinstitution`),
  KEY `fk_idinstitution_ti_idx` (`idinstitution`),
  CONSTRAINT `fk_idinstitution_ti` FOREIGN KEY (`idinstitution`) REFERENCES `institution` (`idinstitution`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_idteacher_ti` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-14  3:16:22
