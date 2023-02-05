CREATE TABLE Italian_Phrases (
    Phrase_id BIGSERIAL NOT NULL, 
    Italian_Phrase VARCHAR(255) NOT NULL, 
    English_Translation VARCHAR(255) NOT NULL,
    PRIMARY KEY (Phrase_id)
);

INSERT INTO Italian_Phrases (Italian_Phrase, English_Translation) VALUES ('Buonasera, signora Marchi!', 'Good evening, Mrs. Marchi!');
INSERT INTO Italian_Phrases (Italian_Phrase, English_Translation) VALUES ('Piacere!', 'Pleased to meet you!');