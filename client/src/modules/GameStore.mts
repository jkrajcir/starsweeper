import { defineStore } from 'pinia'
import { useLocalStorage } from '@vueuse/core'
import { TileProperties } from '@/modules/TileProperties.mjs'
import { TileStatus, TileType } from '@/modules/TileEnums.mjs'
import { DateRange, GameDifficulty, ensureLeaderboardEntriesResponseDto } from '@common'
import type {
  NewTopTimeParamsRequestDto,
  LeaderboardEntriesResponseDto,
  LeaderboardEntry
} from '@common'

function getAdjacentCoordinates(
  x: number,
  y: number,
  visitedCoordinates: Set<string>,
  selectedDifficulty: GameDifficulty
): Set<string> {
  const adjacentX1: number = x + 1
  const adjacentXn1: number = x - 1
  const adjacentY1: number = y + 1
  const adjacentYn1: number = y - 1

  const adjacentCoordinatesArr = new Set<string>()

  if (adjacentX1 < difficultySettings[selectedDifficulty].boardX) {
    if (!visitedCoordinates.has(`${adjacentX1},${y}`)) {
      adjacentCoordinatesArr.add(`${adjacentX1},${y}`)
    }
    if (
      adjacentY1 < difficultySettings[selectedDifficulty].boardY &&
      !visitedCoordinates.has(`${adjacentX1},${adjacentY1}`)
    ) {
      adjacentCoordinatesArr.add(`${adjacentX1},${adjacentY1}`)
    }
    if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${adjacentX1},${adjacentYn1}`)) {
      adjacentCoordinatesArr.add(`${adjacentX1},${adjacentYn1}`)
    }
  }
  if (adjacentXn1 >= 0) {
    if (!visitedCoordinates.has(`${adjacentXn1},${y}`)) {
      adjacentCoordinatesArr.add(`${adjacentXn1},${y}`)
    }
    if (
      adjacentY1 < difficultySettings[selectedDifficulty].boardY &&
      !visitedCoordinates.has(`${adjacentXn1},${adjacentY1}`)
    ) {
      adjacentCoordinatesArr.add(`${adjacentXn1},${adjacentY1}`)
    }
    if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${adjacentXn1},${adjacentYn1}`)) {
      adjacentCoordinatesArr.add(`${adjacentXn1},${adjacentYn1}`)
    }
  }
  if (
    adjacentY1 < difficultySettings[selectedDifficulty].boardY &&
    !visitedCoordinates.has(`${x},${adjacentY1}`)
  ) {
    adjacentCoordinatesArr.add(`${x},${adjacentY1}`)
  }
  if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${x},${adjacentYn1}`)) {
    adjacentCoordinatesArr.add(`${x},${adjacentYn1}`)
  }

  return adjacentCoordinatesArr
}

let gameTimerIntervalId = 0
let randomKey = Math.random()
let timestampWon: string | undefined = undefined

const difficultySettings: { boardX: number; boardY: number; totalStars: number }[] = []
difficultySettings[GameDifficulty.Easy] = { boardX: 9, boardY: 9, totalStars: 10 }
difficultySettings[GameDifficulty.Normal] = { boardX: 16, boardY: 16, totalStars: 40 }
difficultySettings[GameDifficulty.Hard] = { boardX: 30, boardY: 16, totalStars: 99 }

const personalBestTimesKeyPrefix = 'personalBest:'
function personalBestTimesInit() {
  return new Map([
    [GameDifficulty.Easy, useLocalStorage(personalBestTimesKeyPrefix + GameDifficulty.Easy, 0)],
    [GameDifficulty.Normal, useLocalStorage(personalBestTimesKeyPrefix + GameDifficulty.Normal, 0)],
    [GameDifficulty.Hard, useLocalStorage(personalBestTimesKeyPrefix + GameDifficulty.Hard, 0)]
  ])
}

const useGameStore = defineStore('game', {
  state: () => ({
    tileCoordinatesToTileProps: new Map<string, TileProperties>(),
    elapsedTime: 0,
    selectedDifficulty: GameDifficulty.Easy,
    flagsRemaining: difficultySettings[GameDifficulty.Easy].totalStars,
    flagOnly: false,
    gameLost: false,
    gameWon: false,
    placedOnLeaderboard: false,
    newPersonalBestTime: false,
    previousPersonalBestTime: undefined as number | undefined,
    settingsDialog: null as HTMLDialogElement | null,
    gameOverDialog: null as HTMLDialogElement | null,
    leaderboard: new Map<GameDifficulty, Map<DateRange, LeaderboardEntry[]>>(),
    leaderboardSelectedDifficulty: GameDifficulty.Easy,
    personalBestTimes: new Map(personalBestTimesInit()),
    savingNewTopTime: false
  }),
  getters: {
    boardX: (state) => difficultySettings[state.selectedDifficulty].boardX,
    boardY: (state) => difficultySettings[state.selectedDifficulty].boardY
  },
  actions: {
    setupGame(gameDifficulty?: GameDifficulty) {
      if (gameTimerIntervalId !== 0) {
        clearInterval(gameTimerIntervalId)
        gameTimerIntervalId = 0
      }
      this.getLeaderboardEntries()

      if (typeof gameDifficulty !== 'undefined') {
        this.selectedDifficulty = gameDifficulty
        this.leaderboardSelectedDifficulty = this.selectedDifficulty
        randomKey = Math.random()
        this.tileCoordinatesToTileProps.clear()
      }

      const totalStars = difficultySettings[this.selectedDifficulty].totalStars

      const starCoordinatesSet: Set<string> = new Set<string>()
      do {
        const starX = Math.floor(Math.random() * this.boardX)
        const starY = Math.floor(Math.random() * this.boardY)
        starCoordinatesSet.add(`${starX},${starY}`)
      } while (starCoordinatesSet.size < totalStars)

      const coordinatesToStarCount: Map<string, number> = new Map<string, number>()
      for (const starCoordinates of starCoordinatesSet) {
        const starCoordinatesArr: string[] = starCoordinates.split(',')
        const starX: number = Number.parseInt(starCoordinatesArr[0])
        const starY: number = Number.parseInt(starCoordinatesArr[1])

        const adjacentCoordinates = getAdjacentCoordinates(
          starX,
          starY,
          starCoordinatesSet,
          this.selectedDifficulty
        )

        for (const adjacentCoordinate of adjacentCoordinates) {
          const adjacentCoordinatesArr = adjacentCoordinate.split(',')
          const adjacentX = Number.parseInt(adjacentCoordinatesArr[0])
          const adjacentY = Number.parseInt(adjacentCoordinatesArr[1])

          const coordinates = `${adjacentX},${adjacentY}`
          const starCount: number | undefined = coordinatesToStarCount.get(coordinates)

          coordinatesToStarCount.set(coordinates, typeof starCount === 'number' ? starCount + 1 : 1)
        }
      }

      for (let y = 0; y < this.boardY; y++) {
        for (let x = 0; x < this.boardX; x++) {
          let tileProps = this.tileCoordinatesToTileProps.get(`${x},${y}`)
          if (typeof tileProps === 'undefined') {
            tileProps = new TileProperties(x, y, randomKey)
          } else {
            tileProps.resetProperties()
          }
          const tileCoordinates: string = tileProps.coordinates
          if (starCoordinatesSet.has(tileCoordinates)) {
            tileProps.tileType = TileType.Star
          } else {
            const starCount: number | undefined = coordinatesToStarCount.get(tileCoordinates)

            if (typeof starCount === 'number') {
              tileProps.starCount = starCount
              tileProps.tileType = TileType.Adjacent
            }
          }

          if (!this.tileCoordinatesToTileProps.has(`${x},${y}`)) {
            this.tileCoordinatesToTileProps.set(tileCoordinates, tileProps)
          }
        }
      }

      this.elapsedTime = 0
      this.flagOnly = false
      this.flagsRemaining = totalStars
      this.gameLost = false
      this.gameWon = false
      this.newPersonalBestTime = false
      this.placedOnLeaderboard = false
      this.gameOverDialog?.close()
      this.settingsDialog?.close()
    },
    openTile(tileCoordinates: string) {
      const tileCoordinatesToTileProps = this.tileCoordinatesToTileProps
      const clickedTileProps = tileCoordinatesToTileProps.get(tileCoordinates)
      if (
        typeof clickedTileProps === 'undefined' ||
        clickedTileProps.tileStatus === TileStatus.Flagged
      ) {
        return
      }

      if (gameTimerIntervalId === 0) {
        gameTimerIntervalId = setInterval(() => {
          this.elapsedTime++
        }, 1000)
      }

      clickedTileProps.tileStatus = TileStatus.Opened

      if (clickedTileProps.tileType === TileType.Star) {
        // game over
        if (gameTimerIntervalId !== 0) {
          clearInterval(gameTimerIntervalId)
          gameTimerIntervalId = 0
        }

        for (const tileProps of tileCoordinatesToTileProps.values()) {
          if (tileProps.tileType === TileType.Star && tileProps.tileStatus !== TileStatus.Flagged) {
            tileProps.tileStatus = TileStatus.Opened
          }
          if (tileProps.tileStatus === TileStatus.Flagged && tileProps.tileType !== TileType.Star) {
            tileProps.tileStatus = TileStatus.IncorrectlyFlagged
          }
        }

        this.gameLost = true
        this.gameOverDialog?.showModal()
        clickedTileProps.starOpened = true

        return
      }

      if (clickedTileProps.tileType === TileType.Empty) {
        const tileCoordinatesToOpen: Set<string> = new Set<string>()
        tileCoordinatesToOpen.add(clickedTileProps.coordinates)
        const tileCoordinatesToVisit: Set<string> = new Set<string>(tileCoordinatesToOpen)

        for (const tileCoordinateToVisit of tileCoordinatesToVisit) {
          const adjacentTileToOpenCoordinates = getAdjacentCoordinates(
            Number.parseInt(tileCoordinateToVisit.split(',')[0]),
            Number.parseInt(tileCoordinateToVisit.split(',')[1]),
            tileCoordinatesToOpen,
            this.selectedDifficulty
          )

          for (const tileToOpenCoordinates of adjacentTileToOpenCoordinates) {
            tileCoordinatesToOpen.add(tileToOpenCoordinates)

            const tilePropsToOpen = tileCoordinatesToTileProps.get(tileToOpenCoordinates)
            if (
              typeof tilePropsToOpen !== 'undefined' &&
              tilePropsToOpen.tileType === TileType.Empty
            ) {
              tileCoordinatesToVisit.add(tileToOpenCoordinates)
            }
          }
        }

        for (const tileCoordinateToOpen of tileCoordinatesToOpen) {
          const tilePropsToOpen = tileCoordinatesToTileProps.get(tileCoordinateToOpen)
          if (typeof tilePropsToOpen !== 'undefined') {
            if (tilePropsToOpen.tileStatus === TileStatus.Flagged) {
              this.flagsRemaining++
            }
            tilePropsToOpen.tileStatus = TileStatus.Opened
          }
        }
      }

      // check for winning condition
      for (const tileProps of this.tileCoordinatesToTileProps.values()) {
        if (tileProps.tileStatus === TileStatus.Unopened && tileProps.tileType !== TileType.Star) {
          return
        }
      }

      // player has won the game at this point
      if (gameTimerIntervalId !== 0) {
        clearInterval(gameTimerIntervalId)
        gameTimerIntervalId = 0
      }

      timestampWon = new Date().toISOString()

      // put a flag on star tiles that don't have one yet
      for (const tileProps of this.tileCoordinatesToTileProps.values()) {
        if (tileProps.tileType === TileType.Star && tileProps.tileStatus !== TileStatus.Flagged) {
          this.flagsRemaining--
          tileProps.tileStatus = TileStatus.Flagged
        }
      }

      this.gameWon = true
      this.placedOnLeaderboard =
        !this.leaderboard.has(this.selectedDifficulty) ||
        !this.leaderboard.get(this.selectedDifficulty)!.has(DateRange.Today) ||
        this.leaderboard.get(this.selectedDifficulty)!.get(DateRange.Today)!.length === 0 ||
        this.leaderboard.get(this.selectedDifficulty)!.get(DateRange.Today)!.length < 10 ||
        this.leaderboard
          .get(this.selectedDifficulty)!
          .get(DateRange.Today)!
          .some((leaderboardEntry) => this.elapsedTime < leaderboardEntry.elapsedTime)
      const personalBestTime = this.personalBestTimes.get(this.selectedDifficulty)
      if (
        typeof personalBestTime !== 'undefined' &&
        (!personalBestTime.value || this.elapsedTime < personalBestTime.value)
      ) {
        if (!personalBestTime.value) {
          this.previousPersonalBestTime = undefined
        } else {
          this.previousPersonalBestTime = personalBestTime.value
        }
        personalBestTime.value = this.elapsedTime
        this.newPersonalBestTime = true
      }

      this.gameOverDialog?.showModal()
    },
    async getLeaderboardEntries(): Promise<void> {
      const getLeaderboardEntriesRequest = new Request(
        import.meta.env.VITE_GET_LEADERBOARD_ENTRIES_URL,
        {
          method: 'GET'
        }
      )

      let getLeaderboardEntriesResponse: Response
      let getLeaderboardEntriesResponseJson
      try {
        getLeaderboardEntriesResponse = await fetch(getLeaderboardEntriesRequest)
        if (!getLeaderboardEntriesResponse.ok) {
          const responseErrorMsg = await getLeaderboardEntriesResponse.text()
          console.error(
            `HTTP Status: ${getLeaderboardEntriesResponse.status}, Error msg: ${responseErrorMsg}`
          )
        }

        getLeaderboardEntriesResponseJson = await getLeaderboardEntriesResponse.json()
      } catch (e) {
        console.error('Error while trying to get top times.', e)
        return
      }

      let {
        leaderboardEntriesResponseDto
      }: { leaderboardEntriesResponseDto: LeaderboardEntriesResponseDto } =
        getLeaderboardEntriesResponseJson
      try {
        leaderboardEntriesResponseDto = ensureLeaderboardEntriesResponseDto(
          leaderboardEntriesResponseDto
        )
      } catch (e) {
        console.error('Error while trying to validate top times response.', e)
        return
      }

      this.leaderboard.clear()

      for (const leaderboardEntryResponse of leaderboardEntriesResponseDto) {
        let dateRangeLeaderboardEntries = this.leaderboard.get(leaderboardEntryResponse.difficulty)
        if (typeof dateRangeLeaderboardEntries === 'undefined') {
          dateRangeLeaderboardEntries = new Map<DateRange, LeaderboardEntry[]>()
          this.leaderboard.set(leaderboardEntryResponse.difficulty, dateRangeLeaderboardEntries)
        }

        let leaderboardEntries = dateRangeLeaderboardEntries.get(leaderboardEntryResponse.dateRange)
        if (typeof leaderboardEntries === 'undefined') {
          leaderboardEntries = []
          dateRangeLeaderboardEntries.set(leaderboardEntryResponse.dateRange, leaderboardEntries)
        }

        const leaderboardEntry: LeaderboardEntry = {
          playerName: leaderboardEntryResponse.playerName,
          difficulty: leaderboardEntryResponse.difficulty,
          elapsedTime: leaderboardEntryResponse.elapsedTime,
          gameWonTimestamp: leaderboardEntryResponse.gameWonTimestamp,
          dateRange: leaderboardEntryResponse.dateRange,
          dateRangeRanking: leaderboardEntryResponse.dateRangeRanking
        }
        leaderboardEntries.push(leaderboardEntry)
      }

      for (const leaderboardByDifficulty of this.leaderboard) {
        for (const leaderboardByDateRange of leaderboardByDifficulty[1]) {
          leaderboardByDateRange[1].sort(
            (firstEntry, secondEntry) => firstEntry.dateRangeRanking - secondEntry.dateRangeRanking
          )
        }
      }
    },
    async saveNewTopTime(playerName: string): Promise<string | undefined> {
      if (typeof timestampWon === 'undefined') {
        console.error('Undefined timestamp for when game was won.')
        return `Can't save new top time. No timestamp for when game was won.`
      }
      this.savingNewTopTime = true

      const newTopTimeParamsRequestDto: NewTopTimeParamsRequestDto = {
        newTopTimeParams: {
          elapsedTime: this.elapsedTime,
          difficulty: this.selectedDifficulty,
          playerName: playerName,
          gameWonTimestamp: timestampWon
        }
      }

      const saveNewTopTimeRequest = new Request(import.meta.env.VITE_SAVE_NEW_TOP_TIME_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify(newTopTimeParamsRequestDto)
      })

      try {
        const saveNewTopTimeResponse = await fetch(saveNewTopTimeRequest)

        if (saveNewTopTimeResponse.ok) {
          this.getLeaderboardEntries()
          timestampWon = undefined
          this.savingNewTopTime = false
          return
        }

        let errorMessage: string
        if (saveNewTopTimeResponse.status === 405) {
          const allowedHttpMethods = saveNewTopTimeResponse.headers.get('Allow')
          errorMessage = `HTTP Status: ${saveNewTopTimeResponse.status}, Allowed Methods: ${allowedHttpMethods}`
        } else {
          const responseErrorMsg = await saveNewTopTimeResponse.text()
          errorMessage = `HTTP Status: ${saveNewTopTimeResponse.status}, Error Msg: ${responseErrorMsg}`
        }

        console.error(errorMessage)
      } catch (e) {
        console.error('Error while trying to save new top time.', e)
      }

      this.savingNewTopTime = false
      return 'Error while trying to save new top time. Please try again.'
    },
    highlightAdjacentTiles(tileCoordinates: string | undefined = undefined) {
      const tileCoordinatesToTileProps = this.tileCoordinatesToTileProps
      for (const tileProps of tileCoordinatesToTileProps.values()) {
        if (tileProps.highlighted) {
          tileProps.highlighted = false
        }
      }

      if (typeof tileCoordinates === 'undefined') {
        return
      }

      const tileCoordinatesArr = tileCoordinates.split(',')
      const tileX = Number.parseInt(tileCoordinatesArr[0])
      const tileY = Number.parseInt(tileCoordinatesArr[1])
      const tilesToHighlightCoordinates = getAdjacentCoordinates(
        tileX,
        tileY,
        new Set<string>(),
        this.selectedDifficulty
      )

      for (const tileToHighlightCoordinate of tilesToHighlightCoordinates) {
        const tileToHighlightProps = tileCoordinatesToTileProps.get(tileToHighlightCoordinate)
        if (typeof tileToHighlightProps !== 'undefined' && !tileToHighlightProps.highlighted) {
          tileToHighlightProps.highlighted = true
        }
      }
    },
    toggleFlag(tileCoordinatesOrProps: string | TileProperties) {
      const clickedTileProps =
        typeof tileCoordinatesOrProps === 'string'
          ? this.tileCoordinatesToTileProps.get(tileCoordinatesOrProps)
          : tileCoordinatesOrProps
      if (typeof clickedTileProps === 'undefined') {
        return
      }
      if (clickedTileProps.tileStatus === TileStatus.Unopened) {
        this.flagsRemaining--
        clickedTileProps.tileStatus = TileStatus.Flagged
      } else if (clickedTileProps.tileStatus === TileStatus.Flagged) {
        this.flagsRemaining++
        clickedTileProps.tileStatus = TileStatus.Unopened
      }
    }
  }
})

export { useGameStore }
