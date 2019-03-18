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
  `date` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idpoint`),
  KEY `idcomment_idx` (`idcomment`),
  KEY `fk_idteacher_cp_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_cp` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idcomment_fk_cp` FOREIGN KEY (`idcomment`) REFERENCES `resource_comment` (`idcomment`) ON DELETE CASCADE ON UPDATE NO ACTION
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
  `start` datetime DEFAULT NULL,
  `end` datetime DEFAULT NULL,
  `idgoogle` varchar(30) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`idevent`),
  KEY `fk_idteacher_ev_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_ev` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION
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
  KEY `idevent_idx` (`idevent`),
  KEY `fk_idteacher_ec_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_ec` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `idevent_fk_ec` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `file`
--

LOCK TABLES `file` WRITE;
/*!40000 ALTER TABLE `file` DISABLE KEYS */;
INSERT INTO `file` VALUES (1,1,'016589.jpg'),(2,1,'663.jpg'),(3,2,'27.jpg'),(4,4,'663.jpg'),(5,5,'2057c187262063d.jpg'),(6,7,'663.jpg');
/*!40000 ALTER TABLE `file` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `institution`
--

LOCK TABLES `institution` WRITE;
/*!40000 ALTER TABLE `institution` DISABLE KEYS */;
/*!40000 ALTER TABLE `institution` ENABLE KEYS */;
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
  CONSTRAINT `fk_idteacher_mb` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `idevent_fk_m` FOREIGN KEY (`idevent`) REFERENCES `event` (`idevent`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `notification` (
  `idnotification` int(11) NOT NULL AUTO_INCREMENT,
  `description` varchar(200) COLLATE utf8_bin DEFAULT NULL,
  `link` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `type` varchar(45) COLLATE utf8_bin DEFAULT 'registered_event',
  PRIMARY KEY (`idnotification`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

LOCK TABLES `notification` WRITE;
/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
INSERT INTO `notification` VALUES (11,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(12,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(13,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(14,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(15,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(16,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(17,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment'),(18,'El profesor asantiba a comentado su recurso.','show_a_resource(7)','comment');
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;
UNLOCK TABLES;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questionary`
--

LOCK TABLES `questionary` WRITE;
/*!40000 ALTER TABLE `questionary` DISABLE KEYS */;
/*!40000 ALTER TABLE `questionary` ENABLE KEYS */;
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
  KEY `fk_idteacher_rec_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_rec` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource`
--

LOCK TABLES `resource` WRITE;
/*!40000 ALTER TABLE `resource` DISABLE KEYS */;
INSERT INTO `resource` VALUES (1,1,'Escasez de agua','el planeta','2019-03-15 19:33:44','','016589.jpg','Activo'),(2,2,'Estres laboral','En los ultimos años...','2019-03-15 19:36:35','',NULL,'Desactivado'),(3,2,'Estres laboral','En los ultimos años...','2019-03-15 19:38:18','',NULL,'Desactivado'),(4,2,'test','En la ultima clase ...','2019-03-15 19:39:02','',NULL,'Desactivado'),(5,2,'test2','gaga','2019-03-16 16:26:36','','2057c187262063d.jpg','Activo'),(7,2,'test3','test sorpresa','2019-03-16 16:48:55','',NULL,'Activo');
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
  KEY `idresource` (`idresource`),
  KEY `fk_idteacher_rc_idx` (`idteacher`),
  CONSTRAINT `fk_idteacher_rc` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE CASCADE ON UPDATE NO ACTION,
  CONSTRAINT `resource_comment_ibfk_2` FOREIGN KEY (`idresource`) REFERENCES `resource` (`idresource`)
) ENGINE=InnoDB AUTO_INCREMENT=125 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `resource_comment`
--

LOCK TABLES `resource_comment` WRITE;
/*!40000 ALTER TABLE `resource_comment` DISABLE KEYS */;
INSERT INTO `resource_comment` VALUES (55,2,1,'jaaaaaaaaaaaaaaaaaaaaaaaa','2019-03-17 14:20:00'),(109,2,1,'iop','2019-03-17 17:31:44'),(110,1,5,'asd','2019-03-17 17:40:58'),(111,2,1,'sdf','2019-03-17 21:11:46'),(121,2,7,'jo','2019-03-17 21:39:29'),(122,1,7,'{lñ','2019-03-17 21:39:37'),(123,1,7,'5','2019-03-17 21:48:51'),(124,1,7,'ter','2019-03-17 21:59:35');
/*!40000 ALTER TABLE `resource_comment` ENABLE KEYS */;
UNLOCK TABLES;

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
-- Dumping data for table `resource_score`
--

LOCK TABLES `resource_score` WRITE;
/*!40000 ALTER TABLE `resource_score` DISABLE KEYS */;
/*!40000 ALTER TABLE `resource_score` ENABLE KEYS */;
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
INSERT INTO `resource_tag` VALUES (1,1),(1,2),(2,2),(3,2),(4,2),(1,3),(7,3),(1,4),(2,4),(4,4),(5,4),(7,4),(2,5),(3,5),(2,6),(3,6),(4,6),(4,7),(5,7),(7,9),(7,10);
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
  `type` varchar(50) COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`idtag`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tag`
--

LOCK TABLES `tag` WRITE;
/*!40000 ALTER TABLE `tag` DISABLE KEYS */;
INSERT INTO `tag` VALUES (1,'Biología','area'),(2,'Libro/Texto','type'),(3,'Columna de Opinión','type'),(4,'jpg','file'),(5,'Filosofía y Psicología','area'),(6,'Imagen','type'),(7,'Matematica','area'),(8,'Mapa Conceptual','type'),(9,'Química','area'),(10,'Presentación','type');
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
  `mail` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `rut` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `address` varchar(45) COLLATE utf8_bin DEFAULT NULL,
  `perfil_image` varchar(200) COLLATE utf8_bin DEFAULT '/icons/avatar.png',
  `valid` int(11) DEFAULT NULL,
  `public` varchar(45) COLLATE utf8_bin DEFAULT '1,1,0,0,1',
  `birth_date` datetime DEFAULT NULL,
  `date_gen` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idteacher`),
  KEY `idteacher_idx` (`idteacher`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
INSERT INTO `teacher` VALUES (1,'asantiba','asantiba','canespfam@gmail.com','123','1','2','/icons/avatar.png',1,'1,1,0,0,1',NULL,'2019-03-15 18:09:18'),(2,'ban','ban','test@gmail.com','123','11',NULL,'/uploaded-files/2/44.jpg',1,'1,1,1,1,1',NULL,'2019-03-15 18:09:57');
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

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

--
-- Dumping data for table `teacher_institution`
--

LOCK TABLES `teacher_institution` WRITE;
/*!40000 ALTER TABLE `teacher_institution` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher_institution` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher_notification`
--

DROP TABLE IF EXISTS `teacher_notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `teacher_notification` (
  `idteacher_notification` int(11) NOT NULL AUTO_INCREMENT,
  `idteacher` int(11) DEFAULT NULL,
  `idnotification` int(11) DEFAULT NULL,
  `active` int(11) DEFAULT NULL,
  PRIMARY KEY (`idteacher_notification`),
  KEY `fk_idnotification_tn_idx` (`idnotification`),
  KEY `fk_idteacher_tn` (`idteacher`),
  CONSTRAINT `fk_idnotification_tn` FOREIGN KEY (`idnotification`) REFERENCES `notification` (`idnotification`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `fk_idteacher_tn` FOREIGN KEY (`idteacher`) REFERENCES `teacher` (`idteacher`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher_notification`
--

LOCK TABLES `teacher_notification` WRITE;
/*!40000 ALTER TABLE `teacher_notification` DISABLE KEYS */;
INSERT INTO `teacher_notification` VALUES (11,2,11,0),(12,2,12,0),(13,2,13,0),(14,2,14,0),(15,2,15,0),(16,2,16,0),(17,2,17,0),(18,2,18,1);
/*!40000 ALTER TABLE `teacher_notification` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-03-17 22:25:09
