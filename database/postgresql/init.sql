-- Create the Italian_Phrases table
CREATE TABLE Italian_Phrases (
    Phrase_id BIGSERIAL NOT NULL, 
    Italian_Phrase VARCHAR(255) NOT NULL, 
    English_Translation VARCHAR(255) NOT NULL,
    PRIMARY KEY (Phrase_id)
);

-- Insert basic Italian phrases with their English translations
INSERT INTO Italian_Phrases (Italian_Phrase, English_Translation) 
VALUES ('Buonasera, signora Marchi!', 'Good evening, Mrs. Marchi!'),
       ('Piacere!', 'Pleased to meet you!'),
       ('Ciao!', 'Hello!'),
       ('Buongiorno!', 'Good morning!'),
       ('Buon pomeriggio!', 'Good afternoon!'),
       ('Buona notte!', 'Good night!'),
       ('Come stai?', 'How are you?');