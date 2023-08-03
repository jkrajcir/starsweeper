<script import lang="ts">
import { useGameStore } from '@/modules/GameStore.mjs'
import VueDialog from '@/components/VueDialog.vue'
</script>

<script setup lang="ts">
const gameStore = useGameStore()

function newGame() {
  gameStore.setupGame()
}

function toggleFlagging() {
  gameStore.flagOnly = !gameStore.flagOnly
}
</script>

<template>
  <div class="game-header">
    <div class="game-header-top">
      <button class="game-header-button" @click="newGame()">
        <svg class="game-header-icon" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM16.8201 17.0761C18.1628 15.8007 19 13.9981 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C13.0609 19 14.0666 18.764 14.9676 18.3417L13.9928 16.5871C13.3823 16.8527 12.7083 17 12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12H14L16.8201 17.0761Z"
          ></path>
        </svg>
        New game
      </button>
      <button class="game-header-button" @click="gameStore.settingsDialog?.showModal()">
        Settings
      </button>
      <VueDialog
        @setDialogRef="(element) => (gameStore.settingsDialog = element)"
        @closeDialog="gameStore.settingsDialog?.close()"
        >Settings dialog</VueDialog
      >
    </div>
    <div class="game-header-bottom">
      <label class="game-header-label">
        <span class="game-header-label-text">Elapsed time</span>
        <input
          class="game-header-info"
          type="text"
          readonly
          disabled
          :value="gameStore.elapsedTime"
        />
      </label>
      <div class="header-flags">
        <label class="game-header-flags-label">
          <span class="game-header-label-text">Flags remaining</span>
          <input
            class="game-header-info"
            type="text"
            readonly
            disabled
            :value="gameStore.flagsRemaining"
          />
        </label>
        <button class="toggle-flag-button" @click="toggleFlagging()" :disabled="gameStore.gameOver">
          <svg
            class="prohibit-icon"
            :class="{ 'hide-icon': !gameStore.flagOnly }"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path
              d="M7.0943 5.68009L18.3199 16.9057C19.3736 15.5506 20 13.8491 20 12C20 7.58172 16.4183 4 12 4C10.1509 4 8.44939 4.62644 7.0943 5.68009ZM16.9057 18.3199L5.68009 7.0943C4.62644 8.44939 4 10.1509 4 12C4 16.4183 7.58172 20 12 20C13.8491 20 15.5506 19.3736 16.9057 18.3199ZM4.92893 4.92893C6.73748 3.12038 9.23885 2 12 2C17.5228 2 22 6.47715 22 12C22 14.7611 20.8796 17.2625 19.0711 19.0711C17.2625 20.8796 14.7611 22 12 22C6.47715 22 2 17.5228 2 12C2 9.23885 3.12038 6.73748 4.92893 4.92893Z"
            ></path>
          </svg>
          <svg class="game-header-icon" viewBox="0 0 24 24" width="24" height="24">
            <path
              d="M3 3H12.382C12.7607 3 13.107 3.214 13.2764 3.55279L14 5H20C20.5523 5 21 5.44772 21 6V17C21 17.5523 20.5523 18 20 18H13.618C13.2393 18 12.893 17.786 12.7236 17.4472L12 16H5V22H3V3Z"
            ></path>
          </svg>
          <span>{{ gameStore.flagOnly ? 'Disable flag' : 'Enable flag' }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@use 'sass:color';

.game-header {
  display: flex;
  flex-direction: column;
  row-gap: 2rem;
  justify-content: center;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  background-color: honeydew;
  padding: 1.5rem;
  border-radius: 0.3rem;
}

.game-header-top {
  display: flex;
  justify-content: space-between;
}

.game-header-button {
  width: fit-content;
}

.game-header-button,
.toggle-flag-button {
  display: flex;
  align-items: center;
  column-gap: 0.3rem;
  height: fit-content;
  padding: 0.3rem;
  background-color: seagreen;
  color: lightyellow;
  cursor: pointer;
  user-select: none;
  border-radius: 0.2rem;
  border-color: lightcoral;
}

.game-header-icon {
  display: inline;
}

.game-header-bottom {
  display: flex;
  justify-content: space-between;
}

.game-header-label {
  width: min-content;
  height: fit-content;
}

.game-header-label,
.game-header-flags-label {
  display: flex;
  flex-direction: column;
  row-gap: 0.2rem;
  user-select: none;
}

.game-header-label-text {
  white-space: nowrap;
  user-select: auto;
}

.game-header-info {
  display: inline-block;
  width: 100%;
  pointer-events: none;
  border-radius: 0.3rem;
  border-width: 3px;
  border-style: groove;
  border-color: green;
}

.header-flags {
  display: flex;
  flex-direction: column;
  row-gap: 0.75rem;
  width: min-content;
}

.game-header-flags-label {
  width: 100%;
}

.toggle-flag-button {
  justify-content: space-between;
  width: 8.2rem;
  white-space: nowrap;

  &:disabled {
    cursor: default;
    border-color: color.grayscale($color: lightcoral);
    background-color: color.grayscale($color: seagreen);
    color: color.grayscale($color: lightyellow);
  }
}

.prohibit-icon {
  position: absolute;
  fill: red;
  z-index: 100;
}

.hide-icon {
  display: none;
}
</style>
