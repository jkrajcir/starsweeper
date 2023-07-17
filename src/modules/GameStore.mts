import { defineStore } from 'pinia'
import { TileProperties } from '@/modules/TileProperties.mjs'
import { TileStatus, TileType } from '@/modules/TileEnums.mjs'

function getAdjacentCoordinates(
  x: number,
  y: number,
  visitedCoordinates: Set<string>
): Set<string> {
  const adjacentX1: number = x + 1
  const adjacentXn1: number = x - 1
  const adjacentY1: number = y + 1
  const adjacentYn1: number = y - 1

  const adjacentCoordinatesArr = new Set<string>()

  if (adjacentX1 <= 8) {
    if (!visitedCoordinates.has(`${adjacentX1},${y}`)) {
      adjacentCoordinatesArr.add(`${adjacentX1},${y}`)
    }
    if (adjacentY1 <= 8 && !visitedCoordinates.has(`${adjacentX1},${adjacentY1}`)) {
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
    if (adjacentY1 <= 8 && !visitedCoordinates.has(`${adjacentXn1},${adjacentY1}`)) {
      adjacentCoordinatesArr.add(`${adjacentXn1},${adjacentY1}`)
    }
    if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${adjacentXn1},${adjacentYn1}`)) {
      adjacentCoordinatesArr.add(`${adjacentXn1},${adjacentYn1}`)
    }
  }
  if (adjacentY1 <= 8 && !visitedCoordinates.has(`${x},${adjacentY1}`)) {
    adjacentCoordinatesArr.add(`${x},${adjacentY1}`)
  }
  if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${x},${adjacentYn1}`)) {
    adjacentCoordinatesArr.add(`${x},${adjacentYn1}`)
  }

  return adjacentCoordinatesArr
}

let gameTimerIntervalId = 0

const useGameStore = defineStore('game', {
  state: () => ({
    tileCoordinatesToTileProps: new Map<string, TileProperties>(),
    elapsedTime: 0,
    flagsRemaining: 10,
    flagOnly: false,
    gameOver: false
  }),
  getters: {},
  actions: {
    setupGame() {
      if (gameTimerIntervalId !== 0) {
        clearInterval(gameTimerIntervalId)
        gameTimerIntervalId = 0
      }
      const tileCoordinatesToTileProps = this.tileCoordinatesToTileProps

      const starCoordinatesSet: Set<string> = new Set<string>()
      do {
        const starX = Math.floor(Math.random() * 9)
        const starY = Math.floor(Math.random() * 9)
        starCoordinatesSet.add(`${starX},${starY}`)
      } while (starCoordinatesSet.size < 10)

      const coordinatesToStarCount: Map<string, number> = new Map<string, number>()
      for (const starCoordinates of starCoordinatesSet) {
        const starCoordinatesArr: string[] = starCoordinates.split(',')
        const starX: number = Number.parseInt(starCoordinatesArr[0])
        const starY: number = Number.parseInt(starCoordinatesArr[1])

        const adjacentCoordinates = getAdjacentCoordinates(starX, starY, starCoordinatesSet)

        for (const adjacentCoordinate of adjacentCoordinates) {
          const adjacentCoordinatesArr = adjacentCoordinate.split(',')
          const adjacentX = Number.parseInt(adjacentCoordinatesArr[0])
          const adjacentY = Number.parseInt(adjacentCoordinatesArr[1])

          const coordinates = `${adjacentX},${adjacentY}`
          const starCount: number | undefined = coordinatesToStarCount.get(coordinates)

          coordinatesToStarCount.set(coordinates, typeof starCount === 'number' ? starCount + 1 : 1)
        }
      }

      for (let x = 0; x < 9; x++) {
        for (let y = 0; y < 9; y++) {
          let tileProps = tileCoordinatesToTileProps.get(`${x},${y}`)
          if (typeof tileProps === 'undefined') {
            tileProps = new TileProperties(x, y)
          } else {
            tileProps.resetProps()
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

          if (!tileCoordinatesToTileProps.has(`${x},${y}`)) {
            tileCoordinatesToTileProps.set(tileCoordinates, tileProps)
          }
        }
      }

      this.elapsedTime = 0
      this.flagOnly = false
      this.flagsRemaining = 10
      this.gameOver = false
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

        this.gameOver = true
        clickedTileProps.starOpened = true
        for (const tileProps of tileCoordinatesToTileProps.values()) {
          if (tileProps.tileType === TileType.Star && tileProps.tileStatus !== TileStatus.Flagged) {
            tileProps.tileStatus = TileStatus.Opened
          }
          if (tileProps.tileStatus === TileStatus.Flagged && tileProps.tileType !== TileType.Star) {
            tileProps.tileStatus = TileStatus.IncorrectlyFlagged
          }
        }

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
            tileCoordinatesToOpen
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

      for (const tileProps of this.tileCoordinatesToTileProps.values()) {
        if (tileProps.tileType === TileType.Star && tileProps.tileStatus !== TileStatus.Flagged) {
          this.flagsRemaining--
          tileProps.tileStatus = TileStatus.Flagged
        }
      }

      if (gameTimerIntervalId !== 0) {
        clearInterval(gameTimerIntervalId)
        gameTimerIntervalId = 0
      }
      this.gameOver = true
    },
    highlightAdjacentTiles(tileCoordinates: string | undefined = undefined) {
      const tileCoordinatesToTileProps = this.tileCoordinatesToTileProps
      for (const tileProps of tileCoordinatesToTileProps.values()) {
        if (tileProps.tileStatus === TileStatus.Highlighted) {
          tileProps.tileStatus = TileStatus.Unopened
        }
      }

      if (typeof tileCoordinates === 'undefined') {
        return
      }

      const tileCoordinatesArr = tileCoordinates.split(',')
      const tileX = Number.parseInt(tileCoordinatesArr[0])
      const tileY = Number.parseInt(tileCoordinatesArr[1])
      const tilesToHighlightCoordinates = getAdjacentCoordinates(tileX, tileY, new Set<string>())

      for (const tileToHighlightCoordinate of tilesToHighlightCoordinates) {
        const tileToHighlightProps = tileCoordinatesToTileProps.get(tileToHighlightCoordinate)
        if (
          typeof tileToHighlightProps !== 'undefined' &&
          tileToHighlightProps.tileStatus === TileStatus.Unopened
        ) {
          tileToHighlightProps.tileStatus = TileStatus.Highlighted
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
