

SELECT * FROM digiqrp.logbook__countries;
INSERT INTO `digiqrp`.`logbook__countries` (`name`, `code`) VALUES ('Asiatic Russia', 'RU');



SELECT * FROM digiqrp.logbook__entries where `call` like "CU3HN%"

UPDATE `digiqrp`.`logbook__entries` SET `country_slug` = 'RU' WHERE `call` LIKE 'RC9A%';
