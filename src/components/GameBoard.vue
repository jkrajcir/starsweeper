<script import lang="ts">
import Tile from './Tile.vue'
import { useGameStore } from '@/modules/GameStore.mjs'
</script>

<script setup lang="ts">
function getTileCoordinatesFromMouseEvent(mouseEvent: MouseEvent) {
  const elements = document.elementsFromPoint(mouseEvent.clientX, mouseEvent.clientY)
  for (const element of elements) {
    const dataset = (element as HTMLElement).dataset
    if (typeof dataset !== 'undefined' && typeof dataset.coordinates !== 'undefined') {
      return dataset.coordinates
    }
  }
}

function highlightAdjacentTiles(mouseEvent: MouseEvent | undefined = undefined) {
  if (typeof mouseEvent === 'undefined') {
    gameStore.highlightAdjacentTiles()
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }
  gameStore.highlightAdjacentTiles(tileCoordinates)
}

const gameStore = useGameStore()

function gameBoardClick(mouseEvent: MouseEvent) {
  if (gameStore.gameOver) {
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }

  if (gameStore.flagOnly) {
    gameStore.toggleFlag(tileCoordinates)
  } else {
    gameStore.openTile(tileCoordinates)
  }
}

function gameBoardMiddleClick(mousedown: boolean, mouseEvent: MouseEvent) {
  if (gameStore.gameOver) {
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

function gameBoardRightClick(mouseEvent: MouseEvent) {
  if (gameStore.gameOver) {
    return
  }

  const tileCoordinates = getTileCoordinatesFromMouseEvent(mouseEvent)
  if (typeof tileCoordinates === 'undefined') {
    return
  }

  gameStore.toggleFlag(tileCoordinates)
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
    <h1 class="visually-hidden">Game board</h1>
    <template
      v-for="tileProps of gameStore.tileCoordinatesToTileProps.values()"
      :key="tileProps.id"
    >
      <Tile :tile-props="tileProps" />
    </template>
  </div>
</template>

<style>
.game-board {
  display: grid;
  grid-template-columns: repeat(v-bind('gameStore.boardX'), 35px);
  grid-template-rows: repeat(v-bind('gameStore.boardY'), 35px);
  width: 100%;
  overflow-x: auto;
  margin: 0 auto;
  border-width: 3px;
  border-style: inset;
  border-radius: 0.2rem;
  border-color: slategray;
}
</style>
