<script import lang="ts">
import Tile from './Tile.vue'
import { TileProperties } from '@/modules/TileProperties.mjs'
import { TileStatus, TileType } from '@/modules/TileEnums.mjs'
import { reactive } from 'vue'
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

  const adjacentCoordinates = getAdjacentCoordinates(starX, starY, starCoordinatesSet)

  for (const adjacentCoordinate of adjacentCoordinates) {
    const adjacentCoordinatesArr = adjacentCoordinate.split(',')
    const adjacentX = Number.parseInt(adjacentCoordinatesArr[0])
    const adjacentY = Number.parseInt(adjacentCoordinatesArr[1])

    setCoordinatesStarCount(coordinatesToStarCount, [adjacentX, adjacentY])
  }
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

const state = reactive({ tileCoordinatesToTileProps, gameOver: false })

function getTileCoordinatesToOpen(
  tileCoordinatesToOpenSet: Set<string>,
  tileCoordinatesToOpenArr: [x: number, y: number]
): void {
  const tileCoordinatesToOpen: string = `${tileCoordinatesToOpenArr[0]},${tileCoordinatesToOpenArr[1]}`
  tileCoordinatesToOpenSet.add(tileCoordinatesToOpen)

  const tilePropsToOpen = state.tileCoordinatesToTileProps.get(tileCoordinatesToOpen)

  if (typeof tilePropsToOpen !== 'undefined' && tilePropsToOpen.tileType === TileType.Empty) {
    const adjacentTileToOpenCoordinates = getAdjacentCoordinates(
      tileCoordinatesToOpenArr[0],
      tileCoordinatesToOpenArr[1],
      tileCoordinatesToOpenSet
    )

    for (const adjacentTileToOpenCoordinate of adjacentTileToOpenCoordinates) {
      const adjacentTileToOpenCoordinateArr = adjacentTileToOpenCoordinate.split(',')
      const adjacentX = Number.parseInt(adjacentTileToOpenCoordinateArr[0])
      const adjacentY = Number.parseInt(adjacentTileToOpenCoordinateArr[1])

      getTileCoordinatesToOpen(tileCoordinatesToOpenSet, [adjacentX, adjacentY])
    }
  }
}

/**
 * This function checks all adjacent Tiles from "center" tile.
 * Then, for each adjacent that isn't already in coordinateSet, invoke callbacks
 * @param x x-coordinate of "center" Tile
 * @param y y-coordinate of "center" Tile
 * @param visitedCoordinates set of coordinates that have already been visited
 */
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

function getTileCoordinatesFromMouseEvent(mouseEvent: MouseEvent) {
  const elements = document.elementsFromPoint(mouseEvent.clientX, mouseEvent.clientY)
  for (const element of elements) {
    const dataset = (element as HTMLElement).dataset
    if (typeof dataset !== 'undefined' && typeof dataset.coordinates !== 'undefined') {
      return dataset.coordinates
    }
  }
}

const emits = defineEmits<{
  (event: 'startGame'): void
  (event: 'endGame'): void
  (event: 'plantFlag'): void
  (event: 'removeFlag'): void
}>()

function gameBoardClick(mouseEvent: MouseEvent) {
  if (state.gameOver) {
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }

  const clickedTileProps = state.tileCoordinatesToTileProps.get(tileCoordinates)
  if (typeof clickedTileProps === 'undefined') {
    return
  }

  if (clickedTileProps.tileStatus !== TileStatus.Flagged) {
    emits('startGame')
    clickedTileProps.tileStatus = TileStatus.Opened

    if (clickedTileProps.tileType === TileType.Star) {
      // game over
      state.gameOver = true
      emits('endGame')
      clickedTileProps.starOpened = true
      for (const tileProps of state.tileCoordinatesToTileProps.values()) {
        if (tileProps.tileType === TileType.Star && tileProps.tileStatus !== TileStatus.Flagged) {
          tileProps.tileStatus = TileStatus.Opened
        }
        if (tileProps.tileStatus === TileStatus.Flagged && tileProps.tileType !== TileType.Star) {
          tileProps.tileStatus = TileStatus.IncorrectlyFlagged
        }
      }
    } else if (clickedTileProps.tileType === TileType.Empty) {
      const tileCoordinatesToOpenSet: Set<string> = new Set<string>()

      getTileCoordinatesToOpen(tileCoordinatesToOpenSet, [clickedTileProps.x, clickedTileProps.y])

      for (const tileCoordinatesToOpen of tileCoordinatesToOpenSet) {
        const tilePropsToOpen = state.tileCoordinatesToTileProps.get(tileCoordinatesToOpen)
        if (typeof tilePropsToOpen !== 'undefined') {
          tilePropsToOpen.tileStatus = TileStatus.Opened
        }
      }
    }

    // check for winning condition
    for (const tileProps of state.tileCoordinatesToTileProps.values()) {
      if (tileProps.tileStatus === TileStatus.Unopened && tileProps.tileType !== TileType.Star) {
        return
      }
    }

    for (const tileProps of state.tileCoordinatesToTileProps.values()) {
      if (tileProps.tileType === TileType.Star) {
        tileProps.tileStatus = TileStatus.Flagged
      }
    }
    emits('endGame')
    state.gameOver = true
  }
}

function gameBoardMiddleClick(mousedown: boolean, mouseEvent: MouseEvent) {
  if (state.gameOver) {
    return
  }

  if (mousedown) {
    highlightAdjacentTiles(mouseEvent)
    document.addEventListener('mousemove', highlightAdjacentTiles)
  } else {
    document.removeEventListener('mousemove', highlightAdjacentTiles)
    highlightAdjacentTiles()
  }
}

function highlightAdjacentTiles(mouseEvent: MouseEvent | undefined = undefined) {
  for (const tileProps of state.tileCoordinatesToTileProps.values()) {
    if (tileProps.tileStatus === TileStatus.Highlighted) {
      tileProps.tileStatus = TileStatus.Unopened
    }
  }

  if (typeof mouseEvent === 'undefined') {
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }

  const tileCoordinatesArr = tileCoordinates.split(',')
  const tileX = Number.parseInt(tileCoordinatesArr[0])
  const tileY = Number.parseInt(tileCoordinatesArr[1])
  const tilesToHighlightCoordinates = getAdjacentCoordinates(tileX, tileY, new Set<string>())

  for (const tileToHighlightCoordinate of tilesToHighlightCoordinates) {
    const tileToHighlightProps = state.tileCoordinatesToTileProps.get(tileToHighlightCoordinate)
    if (
      typeof tileToHighlightProps !== 'undefined' &&
      tileToHighlightProps.tileStatus === TileStatus.Unopened
    ) {
      tileToHighlightProps.tileStatus = TileStatus.Highlighted
    }
  }
}

function gameBoardRightClick(mouseEvent: MouseEvent) {
  if (state.gameOver) {
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }

  const clickedTileProps = state.tileCoordinatesToTileProps.get(tileCoordinates)
  if (typeof clickedTileProps === 'undefined') {
    return
  }

  if (clickedTileProps.tileStatus === TileStatus.Unopened) {
    emits('plantFlag')
    clickedTileProps.tileStatus = TileStatus.Flagged
  } else if (clickedTileProps.tileStatus === TileStatus.Flagged) {
    emits('removeFlag')
    clickedTileProps.tileStatus = TileStatus.Unopened
  }
}
</script>

<template>
  <div
    @click.left="gameBoardClick($event)"
    @mousedown.middle.prevent="gameBoardMiddleClick(true, $event)"
    @mouseup.middle.prevent="gameBoardMiddleClick(false, $event)"
    @mouseleave="gameBoardMiddleClick(false, $event)"
    @click.right.prevent="gameBoardRightClick($event)"
    class="game-board"
  >
    <Tile
      v-for="(tileProps, index) of state.tileCoordinatesToTileProps.values()"
      :key="index"
      :tile-props="tileProps"
      :game-over="state.gameOver"
    />
  </div>
</template>

<style>
.game-board {
  display: grid;
  grid-template-columns: repeat(9, 35px);
  grid-template-rows: repeat(9, 35px);
  width: fit-content;
  margin: 0 auto;
}
</style>
