import { env } from 'node:process'
import { EOL } from 'node:os'
import pg from 'pg'
import { ClientConfig, QueryConfig } from 'pg'
import { ValidationError } from 'suretype'
import { SaveNewTopTimeEvent, ensureSaveNewTopTimeEvent } from './SaveNewTopTimeEvent.mjs'

async function saveNewTopTime(event: SaveNewTopTimeEvent): Promise<{}> {
  let responseErrorMsg: string | undefined = undefined
  let statusCode: number
  let headers: { Allow: string } | undefined = undefined

  let saveNewTopTimeEvent: SaveNewTopTimeEvent
  try {
    saveNewTopTimeEvent = ensureSaveNewTopTimeEvent(event)
  } catch (e) {
    console.error(e)
    const ajvErrors = (e as ValidationError).errors

    if (ajvErrors.length === 0) {
      responseErrorMsg = 'Error while processing request.'
      statusCode = 400
    } else if (
      ajvErrors.find(
        (ajvError) => ajvError.dataPath.includes('http') || ajvError.dataPath.includes('method')
      )
    ) {
      statusCode = 405
      headers = { Allow: 'POST' }
    } else {
      responseErrorMsg = 'Invalid new top time parameter(s).'
      statusCode = 400
      for (const ajvError of ajvErrors) {
        console.error(ajvError)
      }
    }

    return { body: responseErrorMsg, statusCode: statusCode, headers: headers }
  }

  const { elapsedTime, difficulty, playerName, gameWonTimestamp } =
    saveNewTopTimeEvent.newTopTimeParams

  const starsweeperOnlineDateTime = new Date('2023-08-29').getTime()
  const currentDateTime = new Date().getTime()
  const gameWonTimestampTime = new Date(gameWonTimestamp).getTime()
  if (
    Number.isNaN(gameWonTimestampTime) ||
    gameWonTimestampTime < starsweeperOnlineDateTime ||
    gameWonTimestampTime > currentDateTime
  ) {
    responseErrorMsg = 'Invalid gameWonTimestamp parameter.'
    statusCode = 400
    return { body: responseErrorMsg, statusCode: statusCode }
  }

  const clientConfig: ClientConfig = {
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    host: env.DB_HOST,
    port: Number.parseInt(env.DB_PORT),
    database: env.DB_NAME,
    ssl: {
      ca: env.DB_CA.replaceAll('\\n', EOL)
    }
  }
  const { Client } = pg
  const client = new Client(clientConfig)

  try {
    console.log('Attempting to connect to Postgres DB')
    await client.connect()
    console.log('Connected to Postgres DB')

    const queryConfig: QueryConfig = {
      text: `
        INSERT INTO game.top_times(player_name, difficulty, elapsed_time, game_won_timestamp)
        VALUES ($1, $2, $3, $4)
      `,
      values: [playerName, difficulty, elapsedTime, gameWonTimestamp]
    }

    console.log('Sending INSERT')
    const queryResult = await client.query(queryConfig)
    console.log('Rows affected: ' + queryResult.rowCount)
  } catch (err) {
    console.error(err)
    await client.end()
    responseErrorMsg = 'Error while attempting to save new top time.'
    statusCode = 500
    return { body: responseErrorMsg, statusCode: statusCode }
  }

  await client.end()

  return
}

export const main = saveNewTopTime
