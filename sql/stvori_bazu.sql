DROP TABLE IF EXISTS osobe CASCADE;
DROP SEQUENCE IF EXISTS osobe_SEQ CASCADE;

CREATE SEQUENCE osobe_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE osobe (
    id_osoba int not null DEFAULT nextval('osobe_SEQ'),
	id_uloga int not null DEFAULT 0,
	ime VARCHAR(64) not null,
    prezime VARCHAR(64) not null,
	mail VARCHAR(64) not null,
	datum_rod DATE not null,
	rod CHAR(1),
	password VARCHAR(256) not null,
	
	
    CONSTRAINT osobe_pk PRIMARY KEY (id_osoba)
);