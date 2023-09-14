import { v } from 'suretype'
import { GameDifficulty } from './GameEnums.mjs'

const playerNameValidator = v.string().minLength(1).maxLength(20).required()
const difficultyValidator = v
  .number()
  .integer()
  .enum(
    ...Object.values(GameDifficulty)
      .filter((value) => typeof value !== 'string')
      .map((value) => value as number)
  )
  .required()
const elapsedTimeValidator = v.number().integer().gt(0).lte(32767).required()
const gameWonTimestampValidator = v.string().format('date-time').required()

const dateRangeRankingValidator = v.number().integer().gte(1).lte(10)

export {
  playerNameValidator,
  difficultyValidator,
  elapsedTimeValidator,
  gameWonTimestampValidator,
  dateRangeRankingValidator
}
