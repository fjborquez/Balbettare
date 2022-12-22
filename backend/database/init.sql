CREATE TABLE phrases (
    id BIGSERIAL PRIMARY KEY NOT NULL, 
    english VARCHAR(200) NOT NULL, 
    italian VARCHAR(200) NOT NULL
);

INSERT INTO phrases (english, italian) VALUES ('Good evening, Mrs. Marchi!', 'Buonasera, signora Marchi!');
INSERT INTO phrases (english, italian) VALUES ('Pleased to meet you!', 'Piacere!');