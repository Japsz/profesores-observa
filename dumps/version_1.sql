-- MySQL Script generated by MySQL Workbench
-- 10/21/18 22:20:29
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema profesapp
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema profesapp
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `profesapp` DEFAULT CHARACTER SET utf8 ;
USE `profesapp` ;

-- -----------------------------------------------------
-- Table `profesapp`.`profesor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesapp`.`profesor` (
  `idprofesor` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idinstitucion` INT NULL,
  `username` VARCHAR(45) NULL,
  PRIMARY KEY (`idprofesor`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `profesapp`.`material`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesapp`.`material` (
  `idmaterial` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `idprofesor` INT UNSIGNED NOT NULL,
  `titulo` VARCHAR(100) NULL,
  `descripcion` VARCHAR(200) NULL ,
  `tipo` INT(1) NOT NULL DEFAULT 0,
  `contenido` VARCHAR(100) NULL,
  `n_descargas` INT(11) NULL,
  `f_upload` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idmaterial`),
  INDEX `fk_material_profesor_idx` (`idprofesor` ASC),
  CONSTRAINT `fk_material_profesor`
    FOREIGN KEY (`idprofesor`)
    REFERENCES `profesapp`.`profesor` (`idprofesor`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `profesapp`.`review`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesapp`.`review` (
  `idprofesor` INT UNSIGNED NOT NULL,
  `idmaterial` INT UNSIGNED NOT NULL,
  `contenido` VARCHAR(200) NULL,
  `nota` INT(2) NULL DEFAULT 1,
  `f_gen` DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idprofesor`, `idmaterial`),
  INDEX `fk_profesor_has_material_material1_idx` (`idmaterial` ASC),
  INDEX `fk_profesor_has_material_profesor1_idx` (`idprofesor` ASC),
  CONSTRAINT `fk_profesor_has_material_profesor1`
    FOREIGN KEY (`idprofesor`)
    REFERENCES `profesapp`.`profesor` (`idprofesor`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_profesor_has_material_material1`
    FOREIGN KEY (`idmaterial`)
    REFERENCES `profesapp`.`material` (`idmaterial`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `profesapp`.`tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesapp`.`tag` (
  `idtag` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(50) NULL,
  PRIMARY KEY (`idtag`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `profesapp`.`material_tag`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `profesapp`.`material_tag` (
  `idmaterial` INT UNSIGNED NOT NULL,
  `idtag` INT NOT NULL,
  PRIMARY KEY (`idmaterial`, `idtag`),
  INDEX `fk_material_has_tag_tag1_idx` (`idtag` ASC),
  INDEX `fk_material_has_tag_material1_idx` (`idmaterial` ASC),
  CONSTRAINT `fk_material_has_tag_material1`
    FOREIGN KEY (`idmaterial`)
    REFERENCES `profesapp`.`material` (`idmaterial`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_material_has_tag_tag1`
    FOREIGN KEY (`idtag`)
    REFERENCES `profesapp`.`tag` (`idtag`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE USER 'profesor' IDENTIFIED BY 'profeobserva';

GRANT SELECT, INSERT, TRIGGER, UPDATE ON TABLE `profesapp`.* TO 'profesor';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;