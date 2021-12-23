DROP TABLE IF EXISTS osobe CASCADE;
DROP SEQUENCE IF EXISTS osobe_SEQ CASCADE;

DROP TABLE IF EXISTS grupe CASCADE;
DROP SEQUENCE IF EXISTS grupe_SEQ CASCADE;

DROP TABLE IF EXISTS osoba_grupa CASCADE;

DROP TABLE IF EXISTS tip_pitanja CASCADE;

DROP TABLE IF EXISTS pitanja CASCADE;
DROP SEQUENCE IF EXISTS pitanja_SEQ CASCADE;

DROP TABLE IF EXISTS ankete CASCADE;
DROP SEQUENCE IF EXISTS ankete_SEQ CASCADE;

DROP TABLE IF EXISTS slanje_ankete CASCADE;
DROP SEQUENCE IF EXISTS slanje_ankete_SEQ CASCADE;

DROP TABLE IF EXISTS vlastite_ankete CASCADE;
DROP SEQUENCE IF EXISTS vlastite_ankete_SEQ CASCADE;

DROP TABLE IF EXISTS moguce_opcije CASCADE;
DROP SEQUENCE IF EXISTS moguce_opcije_SEQ CASCADE;

DROP TABLE IF EXISTS odgovori_na_pitanja CASCADE;
DROP SEQUENCE IF EXISTS odgovori_na_pitanja_SEQ CASCADE;

CREATE SEQUENCE osobe_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE osobe
(
    id        int          not null DEFAULT nextval('osobe_SEQ'),
    id_uloga  int          not null DEFAULT 0,
    ime       VARCHAR(64)  not null,
    prezime   VARCHAR(64)  not null,
    mail      VARCHAR(64)  not null,
    datum_rod DATE         not null,
    rod       CHAR(1),
    password  VARCHAR(256) not null,


    CONSTRAINT osobe_pk PRIMARY KEY (id)
);

CREATE SEQUENCE grupe_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE grupe
(
    id  int         not null DEFAULT nextval('grupe_SEQ'),
    ime varchar(64) not null,

    CONSTRAINT grupe_pk PRIMARY KEY (id)
);

CREATE TABLE osoba_grupa
(
    id_osoba int references osobe (id),
    id_grupa int references grupe (id),

    CONSTRAINT osoba_grupa_pk PRIMARY KEY (id_osoba, id_grupa)
);

CREATE TABLE tip_pitanja
(
    id  int         not null,
    tip varchar(64) not null,

    CONSTRAINT tip_pitanja_pk PRIMARY KEY (id)
);



CREATE SEQUENCE ankete_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE ankete
(
    id  int         not null DEFAULT nextval('ankete_SEQ'),
    ime varchar(64) not null,

    CONSTRAINT ankete_pk PRIMARY KEY (id)
);


CREATE SEQUENCE slanje_ankete_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE slanje_ankete
(
    id        int  not null DEFAULT nextval('slanje_ankete_SEQ'),
    datum     date not null,
    id_ankete int references ankete (id),
    trajanje  int  not null,

    CONSTRAINT slanje_ankete_pk PRIMARY KEY (id)
);

CREATE SEQUENCE pitanja_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE pitanja
(
    id             int  not null DEFAULT nextval('pitanja_SEQ'),
    tekst          text not null,
    id_tip_pitanja int references tip_pitanja (id),
    id_ankete      int references ankete (id),
    required       bool          DEFAULT FALSE,

    CONSTRAINT pitanja_pk PRIMARY KEY (id)
);

CREATE SEQUENCE vlastite_ankete_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE vlastite_ankete
(
    id               int not null DEFAULT nextval('vlastite_ankete_SEQ'),
    ispunjena        bool         DEFAULT FALSE,
    mail             VARCHAR(64)  DEFAULT NULL,
    id_slanje_ankete int references slanje_ankete (id),

    CONSTRAINT vlastite_ankete_pk PRIMARY KEY (id)

);
CREATE SEQUENCE odgovori_na_pitanja_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE odgovori_na_pitanja
(
    id               int  not null DEFAULT nextval('odgovori_na_pitanja_SEQ'),
    id_osobe         int references osobe (id),
    id_slanje_ankete int references slanje_ankete (id),
    id_pitanja       int references pitanja (id),
    tekst            text not null,

    CONSTRAINT odgovori_na_pitanja_pk PRIMARY KEY (id)
);
CREATE SEQUENCE moguce_opcije_SEQ INCREMENT BY 1 MINVALUE 0;
CREATE TABLE moguce_opcije
(
    id         int  not null DEFAULT nextval('moguce_opcije_SEQ'),
    id_pitanja int references pitanja (id),
    tekst      text not null,

    CONSTRAINT moguce_opcije_pk PRIMARY KEY (id)
);

insert into tip_pitanja
values (0, 'MCQ');
insert into tip_pitanja
values (1, 'CHECKBOX');
insert into tip_pitanja
values (2, 'FREE_RESPONSE');


