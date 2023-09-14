<script import lang="ts">
import { useGameStore } from '@/modules/GameStore.mjs'
import VueDialog from '@/components/VueDialog.vue'
import { GameDifficulty } from '@/modules/GameEnums.mjs'
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
        <svg class="game-header-icon" width="24" height="24" viewBox="0 0 24 24">
          <path
            d="M9.95401 2.2106C11.2876 1.93144 12.6807 1.92263 14.0449 2.20785C14.2219 3.3674 14.9048 4.43892 15.9997 5.07103C17.0945 5.70313 18.364 5.75884 19.4566 5.3323C20.3858 6.37118 21.0747 7.58203 21.4997 8.87652C20.5852 9.60958 19.9997 10.736 19.9997 11.9992C19.9997 13.2632 20.5859 14.3902 21.5013 15.1232C21.29 15.7636 21.0104 16.3922 20.6599 16.9992C20.3094 17.6063 19.9049 18.1627 19.4559 18.6659C18.3634 18.2396 17.0943 18.2955 15.9997 18.9274C14.9057 19.559 14.223 20.6294 14.0453 21.7879C12.7118 22.067 11.3187 22.0758 9.95443 21.7906C9.77748 20.6311 9.09451 19.5595 7.99967 18.9274C6.90484 18.2953 5.63539 18.2396 4.54272 18.6662C3.61357 17.6273 2.92466 16.4164 2.49964 15.1219C3.41412 14.3889 3.99968 13.2624 3.99968 11.9992C3.99968 10.7353 3.41344 9.60827 2.49805 8.87524C2.70933 8.23482 2.98894 7.60629 3.33942 6.99923C3.68991 6.39217 4.09443 5.83576 4.54341 5.33257C5.63593 5.75881 6.90507 5.703 7.99967 5.07103C9.09364 4.43942 9.7764 3.3691 9.95401 2.2106ZM11.9997 14.9992C13.6565 14.9992 14.9997 13.6561 14.9997 11.9992C14.9997 10.3424 13.6565 8.99923 11.9997 8.99923C10.3428 8.99923 8.99967 10.3424 8.99967 11.9992C8.99967 13.6561 10.3428 14.9992 11.9997 14.9992Z"
          ></path>
        </svg>
        Settings
      </button>
      <VueDialog
        class="settings-dialog"
        @setDialogRef="(element) => (gameStore.settingsDialog = element)"
        @closeDialog="gameStore.settingsDialog?.close()"
      >
        <span class="settings-header">Difficulty:</span>
        <button class="settings-button" @click="gameStore.setupGame(GameDifficulty.Easy)">
          <svg class="game-header-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM7 13C7 15.7614 9.23858 18 12 18C14.7614 18 17 15.7614 17 13H15C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13H7ZM8 11C8.82843 11 9.5 10.3284 9.5 9.5C9.5 8.67157 8.82843 8 8 8C7.17157 8 6.5 8.67157 6.5 9.5C6.5 10.3284 7.17157 11 8 11ZM16 11C16.8284 11 17.5 10.3284 17.5 9.5C17.5 8.67157 16.8284 8 16 8C15.1716 8 14.5 8.67157 14.5 9.5C14.5 10.3284 15.1716 11 16 11Z"
            ></path>
          </svg>
          Easy - 9x9 board, 10 stars
        </button>
        <button class="settings-button" @click="gameStore.setupGame(GameDifficulty.Normal)">
          <svg class="game-header-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM8 14V16H16V14H8ZM8 11C8.82843 11 9.5 10.3284 9.5 9.5C9.5 8.67157 8.82843 8 8 8C7.17157 8 6.5 8.67157 6.5 9.5C6.5 10.3284 7.17157 11 8 11ZM16 11C16.8284 11 17.5 10.3284 17.5 9.5C17.5 8.67157 16.8284 8 16 8C15.1716 8 14.5 8.67157 14.5 9.5C14.5 10.3284 15.1716 11 16 11Z"
            ></path>
          </svg>
          Normal - 16x16 board, 40 stars
        </button>
        <button class="settings-button" @click="gameStore.setupGame(GameDifficulty.Hard)">
          <svg class="game-header-icon" width="24" height="24" viewBox="0 0 24 24">
            <path
              d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM7 17H9C9 15.3431 10.3431 14 12 14C13.6569 14 15 15.3431 15 17H17C17 14.2386 14.7614 12 12 12C9.23858 12 7 14.2386 7 17ZM8 11C8.82843 11 9.5 10.3284 9.5 9.5C9.5 8.67157 8.82843 8 8 8C7.17157 8 6.5 8.67157 6.5 9.5C6.5 10.3284 7.17157 11 8 11ZM16 11C16.8284 11 17.5 10.3284 17.5 9.5C17.5 8.67157 16.8284 8 16 8C15.1716 8 14.5 8.67157 14.5 9.5C14.5 10.3284 15.1716 11 16 11Z"
            ></path>
          </svg>
          Hard - 30x16 board, 99 stars
        </button>
      </VueDialog>
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
  max-width: 370px;
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

.settings-header {
  font-weight: bold;
}

.settings-button,
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

.settings-dialog {
  width: 20rem;
  & > *:last-child {
    margin-top: 1rem;
  }
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
