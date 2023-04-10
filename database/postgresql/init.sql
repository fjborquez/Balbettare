-- Create the Italian_Phrases table
CREATE TABLE italian_Phrases (
    Phrase_id BIGSERIAL NOT NULL, 
    Italian_Phrase VARCHAR(255) NOT NULL, 
    English_Translation VARCHAR(255) NOT NULL,
    PRIMARY KEY (Phrase_id)
);

-- Insert basic Italian phrases with their English translations
INSERT INTO italian_Phrases (Italian_Phrase, English_Translation) 
VALUES ('Piacere!', 'Pleased to meet you!'),
       ('Ciao!', 'Hello!'),
       ('Buongiorno!', 'Good morning!'),
       ('Buon pomeriggio!', 'Good afternoon!'),
       ('Buona notte!', 'Good night!'),
       ('Come stai?', 'How are you?'), 
       ('Buonasera, signora Marchi!', 'Good evening, Mrs. Marchi!');

-- Create the Spanish_Phrases table
CREATE TABLE spanish_Phrases (
    Phrase_id BIGSERIAL NOT NULL, 
    spanish_Phrase VARCHAR(255) NOT NULL, 
    English_Translation VARCHAR(255) NOT NULL,
    PRIMARY KEY (Phrase_id)
);

-- Insert basic Spanish phrases with their English translations
INSERT INTO spanish_Phrases (spanish_Phrase, English_Translation)
VALUES ('¡Mucho gusto!', 'Pleased to meet you!'),
       ('¡Hola!', 'Hello!'),
       ('¡Buenos días!', 'Good morning!'),
       ('¡Buenas tardes!', 'Good afternoon!'),
       ('¡Buenas noches!', 'Good night!'),
       ('¿Cómo estás?', 'How are you?'),
       ('Buenas tardes, señora Marchi!', 'Good evening, Mrs. Marchi!');