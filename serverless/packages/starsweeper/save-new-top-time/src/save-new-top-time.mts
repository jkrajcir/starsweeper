import { env } from 'node:process'
import { EOL } from 'node:os'
import pg from 'pg'
import { ClientConfig, QueryConfig } from 'pg'

export async function main(
  event: {
    http: { method: string }
    elapsedTime: number | string
    difficulty: number | string
    playerName: string
    timestamp: string
  },
  context: {}
): Promise<{}> {
  if (
    typeof event.http === 'undefined' ||
    typeof event.http.method !== 'string' ||
    event.http.method !== 'POST'
  ) {
    return { statusCode: 405, headers: { Allow: 'POST' } }
  }

  const invalidParams: string[] = []
  let { elapsedTime, difficulty, playerName, timestamp } = event
  elapsedTime = Number.parseInt(elapsedTime as string)
  difficulty = Number.parseInt(difficulty as string)

  if (Number.isNaN(elapsedTime) || elapsedTime <= 0 || elapsedTime > 32767) {
    invalidParams.push('elapsedTime')
  }
  if (Number.isNaN(difficulty) || difficulty < 0 || difficulty > 2) {
    invalidParams.push('difficulty')
  }
  if (typeof playerName !== 'string' || playerName.length > 20 || playerName.length === 0) {
    invalidParams.push('playerName')
  }
  const functionStartTimeStamp = 1692311431
  const timestampTime = new Date(timestamp).getTime()
  if (
    Number.isNaN(timestampTime) ||
    timestampTime < functionStartTimeStamp ||
    timestampTime > Date.now()
  ) {
    invalidParams.push('timestamp')
  }

  if (invalidParams.length > 0) {
    return { body: { invalidParams }, statusCode: 400 }
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
      text: 'INSERT INTO game.top_times(player_name, difficulty, elapsed_time, game_won_timestamp) VALUES ($1, $2, $3, $4)',
      values: [playerName, difficulty, elapsedTime, timestamp]
    }

    console.log('Sending INSERT')
    const res = await client.query(queryConfig)
    console.log('Rows affected: ' + res.rowCount)
  } catch (err) {
    console.error(err)
    await client.end()
    return { body: { err }, statusCode: 500 }
  } finally {
    await client.end()
  }

  return
}
