<template>
  <div class="game-header-container">
    <label>
      Elasped Time
      <input type="number" readonly value="0" />
    </label>
    <button>Start/stop game</button>
    <label>
      Stars remaining
      <input type="number" readonly value="10" />
    </label>
  </div>
</template>

<style scoped>
.game-header-container {
  display: flex;
  column-gap: 4rem;
  justify-content: center;
}
</style>
