<script import lang="ts">
import { DateRange, GameDifficulty, DateRangeNames } from '@common'
import { useGameStore } from '@/modules/GameStore.mjs'
import { computed } from 'vue'
</script>

<script setup lang="ts">
const gameStore = useGameStore()

const gameDifficultyEnums = Object.keys(GameDifficulty)
  .map((key) => Number.parseInt(key))
  .filter((key) => Number.isInteger(key))
const dateRangeEnums = Object.keys(DateRange)
  .map((value) => Number.parseInt(value))
  .filter((key) => Number.isInteger(key))

const leaderboardForSelectedDifficulty = computed(() =>
  gameStore.leaderboard.get(gameStore.leaderboardSelectedDifficulty)
)
const personalBestTime = computed(
  () => gameStore.personalBestTimes.get(gameStore.leaderboardSelectedDifficulty)?.value
)
</script>

<template>
  <div class="leaderboard">
    <h1 class="visually-hidden">Leaderboard</h1>
    <div class="leaderboard-header difficulty-pb">
      <label>
        Difficulty:
        <select class="fw-bold" v-model="gameStore.leaderboardSelectedDifficulty">
          <template v-for="gameDifficulty of gameDifficultyEnums" :key="gameDifficulty">
            <option class="fw-bold" :value="gameDifficulty">
              {{ GameDifficulty[gameDifficulty] }}
            </option>
          </template>
        </select>
      </label>
      <span
        >Personal Best:
        <span class="player-score">{{
          personalBestTime ? `${personalBestTime} seconds` : 'Beat the game to set a personal best!'
        }}</span></span
      >
    </div>
    <h2 class="leaderboard-header">Top 10 Times:</h2>
    <div class="top-times">
      <template v-for="dateRange of dateRangeEnums" :key="dateRange">
        <div class="top-times-card">
          <h3>{{ DateRangeNames.get(dateRange) }}</h3>
          <template v-if="!leaderboardForSelectedDifficulty?.get(dateRange)?.length">
            <div class="no-top-times">No top times yet...</div>
          </template>
          <template v-else>
            <ol>
              <template
                v-for="leaderboardEntry of leaderboardForSelectedDifficulty?.get(dateRange)"
                :key="
                  [
                    leaderboardEntry.difficulty,
                    leaderboardEntry.dateRange,
                    leaderboardEntry.gameWonTimestamp
                  ].join('')
                "
              >
                <li>
                  <span class="leaderboard-entry">
                    <span class="fw-bold">{{ leaderboardEntry.elapsedTime }}</span> by
                    <span class="fw-bold">{{ leaderboardEntry.playerName }}</span>
                  </span>
                </li>
              </template>
            </ol>
          </template>
        </div>
      </template>
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
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  padding: 1.5rem;
  background-color: honeydew;
  border-radius: 0.3rem;
  flex: 1 1 0;
}

.no-top-times {
  margin: auto;
  font-size: 1.25rem;
  font-weight: bold;
}

.leaderboard-entry {
  margin-left: 0.5rem;
}

.player-score,
.player-name {
  font-weight: bold;
}

.fw-bold {
  font-weight: bold;
}
</style>
