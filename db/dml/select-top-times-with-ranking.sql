WITH top_times_with_date_range AS (
	SELECT
		id,
		player_name,
		difficulty,
		elapsed_time,
		game_won_timestamp,
		CASE
			WHEN game_won_timestamp::DATE = CURRENT_DATE THEN TRUE ELSE FALSE
		END AS today,
		CASE
			WHEN game_won_timestamp::DATE > CURRENT_DATE - INTERVAL '7 days' THEN TRUE ELSE FALSE
		END AS seven_days,
		CASE
			WHEN game_won_timestamp::DATE > CURRENT_DATE - INTERVAL '30 days' THEN TRUE ELSE FALSE
		END AS thirty_days,
		CASE
			WHEN game_won_timestamp::DATE > CURRENT_DATE - INTERVAL '1 year' THEN TRUE ELSE FALSE
		END AS one_year
	FROM game.top_times
), top_times_with_ranking AS (
	SELECT
		player_name,
		difficulty,
		elapsed_time,
		game_won_timestamp,
		today,
		ROW_NUMBER() OVER (
			PARTITION BY difficulty, today
			ORDER BY elapsed_time ASC, game_won_timestamp ASC, id ASC
		) AS today_ranking,
		seven_days,
		ROW_NUMBER() OVER (
			PARTITION BY difficulty, seven_days
			ORDER BY elapsed_time ASC, game_won_timestamp ASC, id ASC
		) AS seven_days_ranking,
		thirty_days,
		ROW_NUMBER() OVER (
			PARTITION BY difficulty, thirty_days
			ORDER BY elapsed_time ASC, game_won_timestamp ASC, id ASC
		) AS thirty_days_ranking,
		one_year,
		ROW_NUMBER() OVER (
			PARTITION BY difficulty, one_year
			ORDER BY elapsed_time ASC, game_won_timestamp ASC, id ASC
		) AS one_year_ranking,
		ROW_NUMBER() OVER (
			PARTITION BY difficulty
			ORDER BY elapsed_time ASC, game_won_timestamp ASC, id ASC
		) AS alltime_ranking
	FROM top_times_with_date_range
)

SELECT
	player_name,
	difficulty,
	elapsed_time,
	game_won_timestamp::TEXT,
	today,
	CASE
		WHEN today = FALSE OR today_ranking > 10 THEN NULL ELSE today_ranking::SMALLINT
	END,
	seven_days,
	CASE
		WHEN seven_days = FALSE OR seven_days_ranking > 10 THEN NULL ELSE seven_days_ranking::SMALLINT
	END,
	thirty_days,
	CASE
		WHEN thirty_days = FALSE OR thirty_days_ranking > 10 THEN NULL ELSE thirty_days_ranking::SMALLINT
	END,
	one_year,
	CASE
		WHEN one_year = FALSE OR one_year_ranking > 10 THEN NULL ELSE one_year_ranking::SMALLINT
	END,
	CASE
		WHEN alltime_ranking > 10 THEN NULL ELSE alltime_ranking::SMALLINT
	END
FROM top_times_with_ranking
WHERE (today = TRUE AND today_ranking <= 10)
OR (seven_days = TRUE AND seven_days_ranking <= 10)
OR (thirty_days = TRUE AND thirty_days_ranking <= 10)
OR (one_year = TRUE AND one_year_ranking <= 10)
OR alltime_ranking <= 10
