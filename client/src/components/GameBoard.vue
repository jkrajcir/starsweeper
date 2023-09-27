<script import lang="ts">
import { ref } from 'vue'
import GameTile from '@/components/GameTile.vue'
import VueDialog from '@/components/VueDialog.vue'
import { useGameStore } from '@/modules/GameStore.mjs'
</script>

<script setup lang="ts">
let playerName: string | undefined = undefined
const nameInputElement = ref<HTMLInputElement | null>(null)
async function closeGameOverDialog(saveTopTime: boolean = false) {
  if (!saveTopTime) {
    gameStore.gameOverDialog?.close()
    return
  }

  if (nameInputElement.value) {
    if (!playerName) {
      nameInputElement.value.setCustomValidity('Name required to save new top time.')
      nameInputElement.value.reportValidity()
      return
    } else if (playerName.length > 20) {
      nameInputElement.value.maxLength = 20
      nameInputElement.value.setCustomValidity('Name must be 20 characters or lower.')
      nameInputElement.value.reportValidity()
      return
    }

    const errorMessage = await gameStore.saveNewTopTime(playerName)
    if (errorMessage) {
      alert(errorMessage)
    } else {
      playerName = undefined
      gameStore.gameOverDialog?.close()
    }
  }
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
  if (gameStore.gameLost || gameStore.gameWon) {
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
  if (gameStore.gameLost || gameStore.gameWon) {
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
  if (gameStore.gameLost || gameStore.gameWon) {
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
      <GameTile :tile-props="tileProps" />
    </template>
  </div>
  <VueDialog
    @set-dialog-ref="(element) => (gameStore.gameOverDialog = element)"
    @close-button="gameStore.gameOverDialog?.close()"
  >
    <div class="gameover-dialog-result">
      <template v-if="gameStore.gameWon">
        <p>{{ `You won the game in ${gameStore.elapsedTime} seconds!` }}</p>
        <template v-if="gameStore.newPersonalBestTime">
          <p>
            {{
              gameStore.previousPersonalBestTime
                ? `You beat your previous best time of ${gameStore.previousPersonalBestTime}!`
                : `Play again and try to get a new personal best time!`
            }}
          </p>
        </template>
      </template>

      <template v-else>
        {{ 'You lost the game!' }}
      </template>
    </div>

    <template v-if="gameStore.placedOnLeaderboard">
      <div class="dialog-msg">
        <p>You also placed onto the leaderboard!</p>
        <p>Enter a name below for your winning time:</p>
      </div>
      <label class="name-label">
        Name
        <input
          ref="nameInputElement"
          class="name-input"
          maxlength="20"
          type="text"
          v-model="playerName"
        />
      </label>
    </template>
    <template v-if="gameStore.placedOnLeaderboard" #close>
      <button
        class="btn btn-seagreen"
        @click="
          (_) => {
            if (!gameStore.savingNewTopTime) {
              closeGameOverDialog(true)
            }
          }
        "
        :disabled="gameStore.savingNewTopTime"
      >
        Save
      </button>
      <button class="btn btn-lightcoral" @click="closeGameOverDialog()">Cancel</button>
    </template>
  </VueDialog>
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

.dialog-msg {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.gameover-dialog-result {
  font-size: 1.2rem;
  text-align: center;

  & p {
    font-weight: bold;
  }
}

.name-label {
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
  width: 13rem;
  font-weight: bold;
}

.name-input {
  border-radius: 0.3rem;
}
</style>
