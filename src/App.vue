<script import lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import GameBoardHeader from '@/components/GameBoardHeader.vue'
import VueDialog from '@/components/VueDialog.vue'
import { useGameStore } from '@/modules/GameStore.mjs'
import Scoreboard from '@/components/Scoreboard.vue'
import { ref } from 'vue'
</script>

<script setup lang="ts">
const gameStore = useGameStore()
gameStore.setupGame()
let playerName: string | undefined = undefined
const nameInputElement = ref<HTMLInputElement | null>(null)

async function closeDialog(saveTopTime: boolean = false) {
  if (saveTopTime && nameInputElement.value) {
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
  } else {
    gameStore.gameOverDialog?.close()
  }
}
</script>

<template>
  <header>
    <svg class="star-icon" viewBox="0 0 24 24" width="28" height="28">
      <path
        d="M12.0008 17L6.12295 20.5902L7.72105 13.8906L2.49023 9.40983L9.35577 8.85942L12.0008 2.5L14.6458 8.85942L21.5114 9.40983L16.2806 13.8906L17.8787 20.5902L12.0008 17Z"
      ></path>
    </svg>
    <span class="title">Starsweeper</span>
    <svg class="star-icon" viewBox="0 0 24 24" width="28" height="28">
      <path
        d="M12.0008 17L6.12295 20.5902L7.72105 13.8906L2.49023 9.40983L9.35577 8.85942L12.0008 2.5L14.6458 8.85942L21.5114 9.40983L16.2806 13.8906L17.8787 20.5902L12.0008 17Z"
      ></path>
    </svg>
  </header>

  <main>
    <div class="game">
      <GameBoardHeader />
      <GameBoard />
      <VueDialog
        @setDialogRef="(element) => (gameStore.gameOverDialog = element)"
        @closeButton="gameStore.gameOverDialog?.close()"
      >
        <div class="gameover-dialog-result">
          {{
            gameStore.gameWon
              ? `You won the game in ${gameStore.elapsedTime} seconds!`
              : 'You lost the game!'
          }}
        </div>

        <template v-if="gameStore.gameWon">
          <div class="dialog-msg">
            <p>You also placed into a top time!</p>
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
        <template v-if="gameStore.gameWon" #close>
          <button class="btn btn-seagreen" @click="closeDialog(true)">Save</button>
          <button class="btn btn-lightcoral" @click="closeDialog()">Cancel</button>
        </template>
      </VueDialog>
    </div>
    <Scoreboard />
  </main>

  <footer>TODO footer content</footer>
</template>

<style lang="scss">
header {
  padding: 2.5rem 0;
  display: flex;
  column-gap: 1rem;
  justify-content: center;
  align-items: end;
}

main {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  row-gap: 5rem;
  margin-bottom: 2rem;
}

footer {
  border-top-width: 2px;
  border-top-style: solid;
  padding: 1.75rem;
}

.title {
  line-height: 1;
  letter-spacing: 0.3rem;
  margin-right: -0.3rem;
  font-weight: bold;
  font-size: 2rem;
  color: lightyellow;
}

.star-icon {
  fill: gold;
}

.visually-hidden {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
}

.game {
  display: flex;
  flex-direction: column;
  row-gap: 1.5rem;
  background-color: lightcoral;
  width: 100%;
  max-width: fit-content;
  margin-left: auto;
  margin-right: auto;
  padding: 1.75rem;
  border-radius: 0.3rem;
}

.dialog-msg {
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  padding: 0.3rem;
  color: lightyellow;
  cursor: pointer;
  user-select: none;
  border-radius: 0.2rem;
  border-color: lightcoral;
  &.btn-lightcoral {
    background-color: lightcoral;
  }
  &.btn-seagreen {
    background-color: seagreen;
  }
  &.btn-icon {
    column-gap: 0.3rem;
  }
}

.gameover-dialog-result {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: center;
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
