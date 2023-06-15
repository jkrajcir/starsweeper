<script import lang="ts">
import Tile from './Tile.vue'
import { TileProperties } from '@/modules/TileProperties.mjs'
import { TileStatus, TileType } from '@/modules/TileEnums.mjs'
import { ref } from 'vue'
</script>

<script setup lang="ts">
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

  checkAdjacentCoordinates(starX, starY, starCoordinatesSet, {
    callbackParam: coordinatesToStarCount,
    callback: setCoordinatesStarCount
  })
}

function setCoordinatesStarCount(
  coordinatesToStarCount: Map<string, number>,
  coordinatesArr: [x: number, y: number]
) {
  const coordinates = `${coordinatesArr[0]},${coordinatesArr[1]}`
  const starCount: number | undefined = coordinatesToStarCount.get(coordinates)

  coordinatesToStarCount.set(coordinates, typeof starCount === 'number' ? starCount + 1 : 1)
}

const tileCoordinatesToTileProps: Map<string, TileProperties> = new Map<string, TileProperties>()
for (let x = 0; x < 9; x++) {
  for (let y = 0; y < 9; y++) {
    const tileProps: TileProperties = new TileProperties(x, y)
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

    tileCoordinatesToTileProps.set(tileCoordinates, tileProps)
  }
}

const refTileCoordinatesToTileProps = ref(tileCoordinatesToTileProps)

function tileClick(tileCoordinates: string) {
  const clickedTileProps = refTileCoordinatesToTileProps.value.get(tileCoordinates)

  if (
    typeof clickedTileProps !== 'undefined' &&
    clickedTileProps.tileStatus !== TileStatus.Flagged
  ) {
    clickedTileProps.tileStatus = TileStatus.Opened

    if (clickedTileProps.tileType === TileType.Empty) {
      const tileCoordinatesToOpenSet: Set<string> = new Set<string>()

      checkAdjacentCoordinates(
        clickedTileProps.x,
        clickedTileProps.y,
        tileCoordinatesToOpenSet,
        undefined,
        {
          callbackParam: tileCoordinatesToOpenSet,
          callback: getTileCoordinatesToOpen
        }
      )

      for (const tileCoordinatesToOpen of tileCoordinatesToOpenSet) {
        const tilePropsToOpen = refTileCoordinatesToTileProps.value.get(tileCoordinatesToOpen)

        if (typeof tilePropsToOpen !== 'undefined') {
          tilePropsToOpen.tileStatus = TileStatus.Opened
        }
      }
    } else if (clickedTileProps.tileType === TileType.Star) {
      // game over
    }
  }
}

function tileRightClick(tileCoordinates: string) {
  const clickedTileProps = refTileCoordinatesToTileProps.value.get(tileCoordinates)

  if (typeof clickedTileProps !== 'undefined') {
    if (clickedTileProps.tileStatus === TileStatus.Unopened) {
      clickedTileProps.tileStatus = TileStatus.Flagged
    } else if (clickedTileProps.tileStatus === TileStatus.Flagged) {
      clickedTileProps.tileStatus = TileStatus.Unopened
    }
  }
}

function getTileCoordinatesToOpen(
  tileCoordinatesToOpenSet: Set<string>,
  tileCoordinatesToOpenArr: [x: number, y: number]
): void {
  const tileCoordinatesToOpen: string = `${tileCoordinatesToOpenArr[0]},${tileCoordinatesToOpenArr[1]}`
  tileCoordinatesToOpenSet.add(tileCoordinatesToOpen)

  const tilePropsToOpen = refTileCoordinatesToTileProps.value.get(tileCoordinatesToOpen)
  if (typeof tilePropsToOpen !== 'undefined' && tilePropsToOpen.tileType === TileType.Empty) {
    checkAdjacentCoordinates(
      tileCoordinatesToOpenArr[0],
      tileCoordinatesToOpenArr[1],
      tileCoordinatesToOpenSet,
      undefined,
      { callbackParam: tileCoordinatesToOpenSet, callback: getTileCoordinatesToOpen }
    )
  }
}

/**
 * This function checks all adjacent Tiles from "center" tile.
 * Then, for each adjacent that isn't already in coordinateSet, invoke callbacks
 * @param x x-coordinate of "center" Tile
 * @param y y-coordinate of "center" Tile
 * @param visitedCoordinates set of coordinates that have already been visited
 * @param setCoordinatesStarCount
 * @param getTileCoordinatesToOpen
 */
function checkAdjacentCoordinates(
  x: number,
  y: number,
  visitedCoordinates: Set<string>,
  setCoordinatesStarCount?: {
    callbackParam: Map<string, number>
    callback: (
      coordinatesToStarCount: Map<string, number>,
      coordinatesArr: [x: number, y: number]
    ) => void
  },
  getTileCoordinatesToOpen?: {
    callbackParam: Set<string>
    callback: (
      tileCoordinatesToOpenSet: Set<string>,
      tileCoordinatesToOpenArr: [x: number, y: number]
    ) => void
  }
) {
  const adjacentX1: number = x + 1
  const adjacentXn1: number = x - 1
  const adjacentY1: number = y + 1
  const adjacentYn1: number = y - 1

  let adjacentCoordinatesArr: [x: number, y: number][] = []

  if (adjacentX1 <= 8) {
    if (!visitedCoordinates.has(`${adjacentX1},${y}`)) {
      adjacentCoordinatesArr.push([adjacentX1, y])
    }
    if (adjacentY1 <= 8 && !visitedCoordinates.has(`${adjacentX1},${adjacentY1}`)) {
      adjacentCoordinatesArr.push([adjacentX1, adjacentY1])
    }
    if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${adjacentX1},${adjacentYn1}`)) {
      adjacentCoordinatesArr.push([adjacentX1, adjacentYn1])
    }
  }
  if (adjacentXn1 >= 0) {
    if (!visitedCoordinates.has(`${adjacentXn1},${y}`)) {
      adjacentCoordinatesArr.push([adjacentXn1, y])
    }
    if (adjacentY1 <= 8 && !visitedCoordinates.has(`${adjacentXn1},${adjacentY1}`)) {
      adjacentCoordinatesArr.push([adjacentXn1, adjacentY1])
    }
    if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${adjacentXn1},${adjacentYn1}`)) {
      adjacentCoordinatesArr.push([adjacentXn1, adjacentYn1])
    }
  }
  if (adjacentY1 <= 8 && !visitedCoordinates.has(`${x},${adjacentY1}`)) {
    adjacentCoordinatesArr.push([x, adjacentY1])
  }
  if (adjacentYn1 >= 0 && !visitedCoordinates.has(`${x},${adjacentYn1}`)) {
    adjacentCoordinatesArr.push([x, adjacentYn1])
  }

  for (const adjacentCoordinates of adjacentCoordinatesArr) {
    setCoordinatesStarCount?.callback(setCoordinatesStarCount.callbackParam, adjacentCoordinates)
    getTileCoordinatesToOpen?.callback(getTileCoordinatesToOpen.callbackParam, adjacentCoordinates)
  }
}
</script>

<template>
  <div class="game-board">
    <Tile
      @tile-click="tileClick"
      @tile-right-click="tileRightClick"
      v-for="(tileProps, index) of refTileCoordinatesToTileProps.values()"
      :key="index"
      :tile-props="tileProps"
    />
  </div>
</template>

<style scoped>
.game-board {
  display: grid;
  grid-template-columns: repeat(9, 35px);
  grid-template-rows: repeat(9, 35px);
  justify-content: center;
  margin-top: 5rem;
}
</style>
