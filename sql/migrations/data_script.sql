-- INSERT INTO user SET username='omer', password=('ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'), level=1, is_active=1, first_name='עומר', last_name='צור', email='imj.org.il';

INSERT INTO user SET username='yisrael', password=('ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'), level=1, is_active=1, first_name='Yisrael', last_name='Bar', email='yisrael35@gmail.com';
INSERT INTO user SET username='elad.david5', password=('ef797c8118f02dfb649607dd5d3f8c7623048c9c063d532cc95c5ed7a898a64f'), level=1, is_active=1, first_name='Elad', last_name='David', email='elad.david5@gmail.com';

INSERT INTO `imj_db`.`event_type` (`name`) VALUES ('פרטי');
INSERT INTO `imj_db`.`event_type` (`name`) VALUES ('פנימי');
INSERT INTO `imj_db`.`event_type` (`name`) VALUES ('צילומים');
INSERT INTO `imj_db`.`event_type` (`name`) VALUES ('ציבורי');
INSERT INTO `imj_db`.`event_type` (`name`) VALUES ('קהל רחב.מזומנים בלבד');


INSERT INTO `imj_db`.`location` (`name_en`, `name_he`, `mapping`) VALUES ('garden', 'גינה', 'f1');
INSERT INTO `imj_db`.`location` (`name_en`, `name_he`, `mapping`) VALUES ('pool', 'בריכה', 'f2');
INSERT INTO `imj_db`.`location` (`name_en`, `name_he`, `mapping`) VALUES ('book_club', 'מועדון ספרים', 'f3');