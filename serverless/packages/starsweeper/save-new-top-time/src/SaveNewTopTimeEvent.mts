import { v, TypeOf, compile } from 'suretype'
import { newTopTimeParamsSchema } from '@common'

const saveNewTopTimeEventSchema = v.object({
  http: v
    .object({
      method: v.string().const('POST').required()
    })
    .required(),
  newTopTimeParams: newTopTimeParamsSchema.required()
})

type SaveNewTopTimeEvent = TypeOf<typeof saveNewTopTimeEventSchema>

const ensureSaveNewTopTimeEvent = compile(saveNewTopTimeEventSchema, { ensure: true })

export { SaveNewTopTimeEvent, ensureSaveNewTopTimeEvent }
