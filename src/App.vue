<script import lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import GameBoardHeader from '@/components/GameBoardHeader.vue'
import VueDialog from '@/components/VueDialog.vue'
import { useGameStore } from '@/modules/GameStore.mjs'
import Scoreboard from '@/components/Scoreboard.vue'
</script>

<script setup lang="ts">
const gameStore = useGameStore()
gameStore.setupGame()
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
        @closeDialog="gameStore.gameOverDialog?.close()"
        >{{ gameStore.gameWon ? 'You won the game!' : 'You lost the game!' }}</VueDialog
      >
    </div>
    <Scoreboard />
  </main>

  <footer>TODO footer content</footer>
</template>

<style>
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
</style>
