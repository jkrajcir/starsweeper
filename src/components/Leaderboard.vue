<script import lang="ts">
import { GameDifficulty } from '@common'
import { useGameStore } from '@/modules/GameStore.mjs'
</script>

<script setup lang="ts">
const gameStore = useGameStore()
</script>

<template>
  <div class="leaderboard">
    <h1 class="visually-hidden">Leaderboard</h1>
    <div class="leaderboard-header difficulty-pb">
      <label>
        Difficulty:
        <select v-model="gameStore.selectedDifficulty">
          <option :value="GameDifficulty.Easy">{{ GameDifficulty[GameDifficulty.Easy] }}</option>
          <option :value="GameDifficulty.Normal">
            {{ GameDifficulty[GameDifficulty.Normal] }}
          </option>
          <option :value="GameDifficulty.Hard">{{ GameDifficulty[GameDifficulty.Hard] }}</option>
        </select>
      </label>
      <span>Personal best: 25</span>
    </div>
    <h2 class="leaderboard-header">Top 10 times for:</h2>
    <div class="top-times">
      <div class="top-times-card">
        <h3>Today</h3>
        <ol>
          <li>25 by <span class="player-name">player1</span></li>
        </ol>
      </div>
      <div class="top-times-card">
        <h3>Last 7 days</h3>
        <ol></ol>
      </div>
      <div class="top-times-card">
        <h3>Last 30 days</h3>
        <ol></ol>
      </div>
      <div class="top-times-card">
        <h3>Last year</h3>
        <ol></ol>
      </div>
      <div class="top-times-card">
        <h3>All time</h3>
        <ol></ol>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.leaderboard {
  background-color: lightcoral;
  margin: 0 2rem;
  padding: 1.75rem;
  border-radius: 0.3rem;
  display: flex;
  row-gap: 1.5rem;
  flex-direction: column;
}

.leaderboard-header {
  font-size: 1.5rem;
  width: fit-content;
}

.difficulty-pb {
  display: flex;
  column-gap: 1.5rem;
}

.top-times {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.top-times-card {
  padding: 1.5rem;
  background-color: honeydew;
  border-radius: 0.3rem;
  flex-grow: 1;
  flex-shrink: 0;
}

.player-name {
  font-weight: bold;
}
</style>
