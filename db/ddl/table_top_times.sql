-- Table: game.top_times

-- DROP TABLE IF EXISTS game.top_times;

CREATE TABLE IF NOT EXISTS game.top_times
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    player_name character varying(20) COLLATE pg_catalog."default" NOT NULL,
    difficulty smallint NOT NULL,
    elapsed_time smallint NOT NULL,
    game_won_date date NOT NULL,
    CONSTRAINT top_times_pkey PRIMARY KEY (id),
    CONSTRAINT top_times_difficulty_check CHECK (difficulty >= 0 AND difficulty <= 2),
    CONSTRAINT top_times_elapsed_time_check CHECK (elapsed_time > 0),
    CONSTRAINT top_times_game_won_date_check CHECK (game_won_date <= CURRENT_DATE),
    CONSTRAINT top_times_player_name_check CHECK (length(player_name::text) > 0)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS game.top_times
    OWNER to doadmin;

REVOKE ALL ON TABLE game.top_times FROM read_starsweeper;
REVOKE ALL ON TABLE game.top_times FROM write_starsweeper;

GRANT ALL ON TABLE game.top_times TO doadmin;

GRANT SELECT ON TABLE game.top_times TO read_starsweeper;

GRANT INSERT ON TABLE game.top_times TO write_starsweeper;