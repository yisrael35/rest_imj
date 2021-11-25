-- MySQL Workbench Synchronization
-- Generated: 2021-11-25 06:51
-- Model: New Model
-- Version: 1.0
-- Project: Name of the project
-- Author: yisra

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

ALTER TABLE `imj_db`.`token` 
DROP FOREIGN KEY `fk_token_user1`;

ALTER TABLE `imj_db`.`bid` 
DROP FOREIGN KEY `fk_bid_event_type1`,
DROP FOREIGN KEY `fk_bid_user1`,
DROP FOREIGN KEY `fk_bid_template_data1`;

ALTER TABLE `imj_db`.`cost` 
DROP FOREIGN KEY `fk_costs_bid1`,
DROP FOREIGN KEY `fk_costs_event1`;

ALTER TABLE `imj_db`.`event` 
DROP FOREIGN KEY `fk_event_user1`,
DROP FOREIGN KEY `fk_event_template_data1`;

ALTER TABLE `imj_db`.`schedule_event` 
DROP FOREIGN KEY `fk_schedule_event_bid1`;

ALTER TABLE `imj_db`.`user` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `imj_db`.`token` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `imj_db`.`bid` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP INDEX `fk_bid_template_data1_idx` ;
;

ALTER TABLE `imj_db`.`location` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `imj_db`.`cost` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
CHANGE COLUMN `discount` `discount` DOUBLE NULL DEFAULT 0 ;

ALTER TABLE `imj_db`.`event` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP INDEX `fk_event_template_data1_idx` ;
;

ALTER TABLE `imj_db`.`schedule_event` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

ALTER TABLE `imj_db`.`event_type` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ,
DROP COLUMN `uuid`,
DROP COLUMN `content`,
DROP COLUMN `language`,
ADD COLUMN `language` VARCHAR(45) NULL DEFAULT NULL AFTER `name`,
ADD COLUMN `content` LONGTEXT NULL DEFAULT NULL AFTER `language`,
CHANGE COLUMN `name` `name` LONGTEXT NOT NULL ,
CHANGE COLUMN `fields` `fields` JSON NULL ;

ALTER TABLE `imj_db`.`client` 
CHARACTER SET = utf8 , COLLATE = utf8_general_ci ;

DROP TABLE IF EXISTS `imj_db`.`template_data` ;

ALTER TABLE `imj_db`.`token` 
ADD CONSTRAINT `fk_token_user1`
  FOREIGN KEY (`user_id`)
  REFERENCES `imj_db`.`user` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `imj_db`.`bid` 
DROP FOREIGN KEY `fk_bid_location1`;

ALTER TABLE `imj_db`.`bid` ADD CONSTRAINT `fk_bid_location1`
  FOREIGN KEY (`location_id`)
  REFERENCES `imj_db`.`location` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_bid_event_type1`
  FOREIGN KEY (`event_type_id`)
  REFERENCES `imj_db`.`event_type` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_bid_user1`
  FOREIGN KEY (`user_id`)
  REFERENCES `imj_db`.`user` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `imj_db`.`cost` 
ADD CONSTRAINT `fk_costs_bid1`
  FOREIGN KEY (`bid_id`)
  REFERENCES `imj_db`.`bid` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_costs_event1`
  FOREIGN KEY (`event_id`)
  REFERENCES `imj_db`.`event` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `imj_db`.`event` 
ADD CONSTRAINT `fk_event_user1`
  FOREIGN KEY (`user_id`)
  REFERENCES `imj_db`.`user` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;

ALTER TABLE `imj_db`.`schedule_event` 
DROP FOREIGN KEY `fk_schedule_event_event1`;

ALTER TABLE `imj_db`.`schedule_event` ADD CONSTRAINT `fk_schedule_event_event1`
  FOREIGN KEY (`event_id`)
  REFERENCES `imj_db`.`event` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION,
ADD CONSTRAINT `fk_schedule_event_bid1`
  FOREIGN KEY (`bid_id`)
  REFERENCES `imj_db`.`bid` (`id`)
  ON DELETE NO ACTION
  ON UPDATE NO ACTION;


DELIMITER $$

USE `imj_db`$$
DROP TRIGGER IF EXISTS `imj_db`.`user_BEFORE_INSERT` $$

USE `imj_db`$$
CREATE  TRIGGER `imj_db`.`user_BEFORE_INSERT` BEFORE INSERT ON `user` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
DROP TRIGGER IF EXISTS `imj_db`.`bid_BEFORE_INSERT` $$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`bid_BEFORE_INSERT` BEFORE INSERT ON `bid` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
DROP TRIGGER IF EXISTS `imj_db`.`event_BEFORE_INSERT` $$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`event_BEFORE_INSERT` BEFORE INSERT ON `event` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$

USE `imj_db`$$
DROP TRIGGER IF EXISTS `imj_db`.`client_BEFORE_INSERT` $$

USE `imj_db`$$
CREATE TRIGGER `imj_db`.`client_BEFORE_INSERT` BEFORE INSERT ON `client` FOR EACH ROW
BEGIN
	SET NEW.`uuid` = UUID();
END$$


DELIMITER ;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
