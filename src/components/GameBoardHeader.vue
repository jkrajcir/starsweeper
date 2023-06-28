<script setup lang="ts">
const { elapsedTime, flagsRemaining } = defineProps<{
  elapsedTime: number
  flagsRemaining: number
}>()
</script>

<template>
  <div class="game-header-container">
    <label>
      Elasped Time
      <input class="game-header-info" type="number" readonly :value="elapsedTime" />
    </label>
    <button class="restart-button" @click="">Restart game</button>
    <label>
      Flags remaining
      <input class="game-header-info" type="number" readonly :value="flagsRemaining" />
    </label>
  </div>
</template>

<style>
.game-header-container {
  display: flex;
  column-gap: 4rem;
  justify-content: center;
}

.game-header-info {
  display: block;
}

.restart-button {
  height: fit-content;
  margin-top: auto;
  margin-bottom: auto;
}
</style>
