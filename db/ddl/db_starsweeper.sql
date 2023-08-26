-- Database: starsweeper

-- DROP DATABASE IF EXISTS starsweeper;

CREATE DATABASE starsweeper
    WITH
    OWNER = doadmin
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;

GRANT TEMPORARY, CONNECT ON DATABASE starsweeper TO PUBLIC;

GRANT ALL ON DATABASE starsweeper TO doadmin;