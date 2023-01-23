-- Active: 1674477642267@@127.0.0.1@3306

-- Tabelas já foram criadas
CREATE TABLE bands (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL
);

DROP TABLE bands;

DROP TABLES songs;

CREATE TABLE songs (
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    name TEXT NOT NULL,
    band_id TEXT NOT NULL,
    FOREIGN KEY (band_id) REFERENCES bands (id)
);
