-- MySQL Workbench Synchronization
-- Generated: 2021-11-21 21:58
-- Model: New Model
-- Version: 1.0
-- Project: imj
-- Author: yisra

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE DATABASE IF NOT EXISTS imj_db;

CREATE SCHEMA IF NOT EXISTS `imj_db` DEFAULT CHARACTER SET utf8 ;

CREATE TABLE IF NOT EXISTS `imj_db`.`user` (
  `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(45) NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(45) NOT NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `level` INT(11) NOT NULL DEFAULT 2,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `is_active` INT(11) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`token` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `content` VARCHAR(255) NOT NULL,
  `is_active` INT(11) NOT NULL DEFAULT 1,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `fk_token_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_token_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `imj_db`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`bid` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(45) NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `event_type_id` INT(11) NOT NULL,
  `location_id` INT(11) NULL DEFAULT NULL,
  `status` ENUM('draft', 'sent', 'approved') NOT NULL,
  `comment` VARCHAR(200) NULL DEFAULT NULL,
  `total_a_discount` DOUBLE NOT NULL,
  `total_b_discount` DOUBLE NOT NULL,
  `total_discount` DOUBLE NOT NULL,
  `currency` ENUM('nis', 'usd') NOT NULL DEFAULT 'nis',
  `client_name` VARCHAR(45) NOT NULL,
  `event_name` VARCHAR(45) NOT NULL,
  `event_date` TIMESTAMP NULL DEFAULT NULL,
  `max_participants` INT(11) NULL DEFAULT NULL,
  `min_participants` INT(11) NOT NULL DEFAULT 0,
  `created_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `template_data_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  INDEX `fk_bid_location1_idx` (`location_id` ASC) VISIBLE,
  INDEX `fk_bid_event_type1_idx` (`event_type_id` ASC) VISIBLE,
  INDEX `fk_bid_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_bid_template_data1_idx` (`template_data_id` ASC) VISIBLE,
  CONSTRAINT `fk_bid_location1`
    FOREIGN KEY (`location_id`)
    REFERENCES `imj_db`.`location` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bid_event_type1`
    FOREIGN KEY (`event_type_id`)
    REFERENCES `imj_db`.`event_type` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bid_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `imj_db`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_bid_template_data1`
    FOREIGN KEY (`template_data_id`)
    REFERENCES `imj_db`.`template_data` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`location` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name_en` VARCHAR(45) NOT NULL,
  `name_he` VARCHAR(45) NOT NULL,
  `mapping` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`cost` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NULL DEFAULT NULL,
  `bid_id` INT(11) NULL DEFAULT NULL,
  `description` VARCHAR(200) NOT NULL,
  `amount` DOUBLE UNSIGNED NOT NULL DEFAULT 1,
  `unit_cost` DOUBLE UNSIGNED NOT NULL DEFAULT 1,
  `total_cost` DOUBLE NOT NULL DEFAULT 0,
  `discount` DOUBLE NULL DEFAULT 0,
  `comment` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_costs_bid1_idx` (`bid_id` ASC) VISIBLE,
  INDEX `fk_costs_event1_idx` (`event_id` ASC) VISIBLE,
  CONSTRAINT `fk_costs_bid1`
    FOREIGN KEY (`bid_id`)
    REFERENCES `imj_db`.`bid` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_costs_event1`
    FOREIGN KEY (`event_id`)
    REFERENCES `imj_db`.`event` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`event` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `user_id` INT(10) UNSIGNED NOT NULL,
  `max_participants` INT(11) NULL DEFAULT NULL,
  `min_participants` INT(11) NULL DEFAULT 0,
  `date` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `template_data_id` INT(11) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_event_user1_idx` (`user_id` ASC) VISIBLE,
  INDEX `fk_event_template_data1_idx` (`template_data_id` ASC) VISIBLE,
  CONSTRAINT `fk_event_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `imj_db`.`user` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_event_template_data1`
    FOREIGN KEY (`template_data_id`)
    REFERENCES `imj_db`.`template_data` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`schedule_event` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `event_id` INT(11) NULL DEFAULT NULL,
  `bid_id` INT(11) NULL DEFAULT NULL,
  `start_activity` TIME NOT NULL,
  `end_activity` TIME NOT NULL,
  `description` VARCHAR(200) NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_schedule_event_event1_idx` (`event_id` ASC) VISIBLE,
  INDEX `fk_schedule_event_bid1_idx` (`bid_id` ASC) VISIBLE,
  CONSTRAINT `fk_schedule_event_event1`
    FOREIGN KEY (`event_id`)
    REFERENCES `imj_db`.`event` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_schedule_event_bid1`
    FOREIGN KEY (`bid_id`)
    REFERENCES `imj_db`.`bid` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`event_type` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `language` VARCHAR(45) NULL DEFAULT NULL,
  `content` LONGTEXT NULL DEFAULT NULL,
  `fields` JSON NULL,
  `uuid` VARCHAR(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`client` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(45) NULL DEFAULT NULL,
  `email` VARCHAR(45) NULL DEFAULT NULL,
  `type` ENUM('private', 'company', 'department') NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS `imj_db`.`template_data` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `values` JSON NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


DELIMITER $$

USE `imj_db`$$
CREATE  TRIGGER `imj_db`.`user_BEFORE_INSERT` BEFORE INSERT ON `user` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`bid_BEFORE_INSERT` BEFORE INSERT ON `bid` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`event_BEFORE_INSERT` BEFORE INSERT ON `event` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`client_BEFORE_INSERT` BEFORE INSERT ON `client` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$


DELIMITER ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
