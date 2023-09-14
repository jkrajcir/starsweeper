import { v, TypeOf, compile } from 'suretype'
import { DateRange } from './GameEnums.mjs'
import {
  dateRangeRankingValidator,
  difficultyValidator,
  elapsedTimeValidator,
  gameWonTimestampValidator,
  playerNameValidator
} from './CommonValidators.mjs'

const leaderboardEntrySchema = v.object({
  playerName: playerNameValidator,
  difficulty: difficultyValidator,
  elapsedTime: elapsedTimeValidator,
  gameWonTimestamp: gameWonTimestampValidator,
  dateRange: v
    .number()
    .integer()
    .enum(
      ...Object.values(DateRange)
        .filter((value) => typeof value !== 'string')
        .map((value) => value as number)
    )
    .required(),
  dateRangeRanking: dateRangeRankingValidator.required()
})
const leaderboardEntriesResponseDtoSchema = v.array(leaderboardEntrySchema)

type LeaderboardEntriesResponseDto = TypeOf<typeof leaderboardEntriesResponseDtoSchema>
type LeaderboardEntry = TypeOf<typeof leaderboardEntrySchema>

const ensureLeaderboardEntriesResponseDto = compile(leaderboardEntriesResponseDtoSchema, {
  ensure: true
})

export { LeaderboardEntriesResponseDto, LeaderboardEntry, ensureLeaderboardEntriesResponseDto }
