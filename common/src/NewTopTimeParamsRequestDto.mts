import { v, TypeOf } from 'suretype'
import {
  difficultyValidator,
  elapsedTimeValidator,
  gameWonTimestampValidator,
  playerNameValidator
} from './CommonValidators.mjs'

const newTopTimeParamsSchema = v.object({
  playerName: playerNameValidator,
  difficulty: difficultyValidator,
  elapsedTime: elapsedTimeValidator,
  gameWonTimestamp: gameWonTimestampValidator
})

const newTopTimeParamsRequestDtoSchema = v.object({
  newTopTimeParams: newTopTimeParamsSchema.required()
})

type NewTopTimeParams = TypeOf<typeof newTopTimeParamsSchema>
type NewTopTimeParamsRequestDto = TypeOf<typeof newTopTimeParamsRequestDtoSchema>

export { newTopTimeParamsSchema, NewTopTimeParams, NewTopTimeParamsRequestDto }
