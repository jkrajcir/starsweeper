<script import lang="ts">
import { reactive } from 'vue'
import GameBoard from './components/GameBoard.vue'
import GameBoardHeader from './components/GameBoardHeader.vue'
</script>

<script setup lang="ts">
const state = reactive({ elapsedTime: 0, flagsRemaining: 10 })
let gameTimerIntervalId = 0

function startGameTimer() {
  gameTimerIntervalId = setInterval(() => {
    state.elapsedTime++
  }, 1000)
}

function stopGameTimer() {
  clearInterval(gameTimerIntervalId)
}

function plantFlag() {
  state.flagsRemaining--
}

function removeFlag() {
  state.flagsRemaining++
}
</script>

<template>
  <header>Starsweeper</header>

  <main>
    <GameBoardHeader :elapsed-time="state.elapsedTime" :flags-remaining="state.flagsRemaining" />
    <GameBoard
      @start-game.once="startGameTimer()"
      @end-game.once="stopGameTimer()"
      @plant-flag="plantFlag()"
      @remove-flag="removeFlag()"
    />
  </main>
</template>

<style>
header {
  text-align: center;
  margin: 5rem 0;
  letter-spacing: 0.5rem;
  font-weight: bold;
  font-size: 2rem;
}

main {
  display: flex;
  flex-direction: column;
  row-gap: 3rem;
  background-color: aquamarine;
}

/* header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
} */
</style>
