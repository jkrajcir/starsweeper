import {
  playerNameValidator,
  difficultyValidator,
  elapsedTimeValidator,
  gameWonTimestampValidator,
  dateRangeRankingValidator
} from '@common'
import { v, TypeOf, compile } from 'suretype'

const dateRangeValidator = v.boolean().required()
const dateRangeRankOrNullValidator = v.anyOf([dateRangeRankingValidator, v.null()]).required()

const topTimeWithRankingDbResultsSchema = v.array(
  v.object({
    player_name: playerNameValidator,
    difficulty: difficultyValidator,
    elapsed_time: elapsedTimeValidator,
    game_won_timestamp: gameWonTimestampValidator,
    today: dateRangeValidator,
    today_ranking: dateRangeRankOrNullValidator,
    seven_days: dateRangeValidator,
    seven_days_ranking: dateRangeRankOrNullValidator,
    thirty_days: dateRangeValidator,
    thirty_days_ranking: dateRangeRankOrNullValidator,
    one_year: dateRangeValidator,
    one_year_ranking: dateRangeRankOrNullValidator,
    alltime_ranking: dateRangeRankOrNullValidator
  })
)

type TopTimeWithRankingDbResults = TypeOf<typeof topTimeWithRankingDbResultsSchema>

const ensureTopTimeWithRankingDbResults = compile(topTimeWithRankingDbResultsSchema, {
  ensure: true
})

export { TopTimeWithRankingDbResults, ensureTopTimeWithRankingDbResults }
