<script import lang="ts">
import GameBoard from '@/components/GameBoard.vue'
import GameBoardHeader from '@/components/GameBoardHeader.vue'
import GameLeaderboard from '@/components/GameLeaderboard.vue'
import { useGameStore } from '@/modules/GameStore.mjs'
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
    </div>
    <GameLeaderboard />
  </main>

  <footer>
    <p>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM20 12L16.4645 15.5355L15.0503 14.1213L17.1716 12L15.0503 9.87868L16.4645 8.46447L20 12ZM6.82843 12L8.94975 14.1213L7.53553 15.5355L4 12L7.53553 8.46447L8.94975 9.87868L6.82843 12ZM11.2443 17H9.11597L12.7557 7H14.884L11.2443 17Z"
        ></path>
      </svg>
      <span>Made by: <a href="https://jkrajcir.dev/">https://jkrajcir.dev/</a></span>
    </p>
    <p>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path
          d="M12.001 2C6.47598 2 2.00098 6.475 2.00098 12C2.00098 16.425 4.86348 20.1625 8.83848 21.4875C9.33848 21.575 9.52598 21.275 9.52598 21.0125C9.52598 20.775 9.51348 19.9875 9.51348 19.15C7.00098 19.6125 6.35098 18.5375 6.15098 17.975C6.03848 17.6875 5.55098 16.8 5.12598 16.5625C4.77598 16.375 4.27598 15.9125 5.11348 15.9C5.90098 15.8875 6.46348 16.625 6.65098 16.925C7.55098 18.4375 8.98848 18.0125 9.56348 17.75C9.65098 17.1 9.91348 16.6625 10.201 16.4125C7.97598 16.1625 5.65098 15.3 5.65098 11.475C5.65098 10.3875 6.03848 9.4875 6.67598 8.7875C6.57598 8.5375 6.22598 7.5125 6.77598 6.1375C6.77598 6.1375 7.61348 5.875 9.52598 7.1625C10.326 6.9375 11.176 6.825 12.026 6.825C12.876 6.825 13.726 6.9375 14.526 7.1625C16.4385 5.8625 17.276 6.1375 17.276 6.1375C17.826 7.5125 17.476 8.5375 17.376 8.7875C18.0135 9.4875 18.401 10.375 18.401 11.475C18.401 15.3125 16.0635 16.1625 13.8385 16.4125C14.201 16.725 14.5135 17.325 14.5135 18.2625C14.5135 19.6 14.501 20.675 14.501 21.0125C14.501 21.275 14.6885 21.5875 15.1885 21.4875C19.259 20.1133 21.9999 16.2963 22.001 12C22.001 6.475 17.526 2 12.001 2Z"
        ></path>
      </svg>
      <span
        >GitHub: <a href="https://github.com/jkrajcir/starsweeper">jkrajcir/starsweeper</a></span
      >
    </p>
  </footer>
</template>

<style lang="scss">
@use 'sass:color';

header {
  margin: 2.5rem 0;
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
  margin-bottom: 7rem;
}

footer {
  padding: 2.5rem 2rem;
  background-color: lightgoldenrodyellow;
  display: flex;
  flex-direction: column;
  row-gap: 1rem;

  & svg {
    display: inline;
  }

  & p {
    display: flex;
    align-items: center;
    column-gap: 0.25rem;
  }
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

    &:disabled {
      color: color.grayscale($color: lightyellow);
      background-color: color.grayscale($color: seagreen);
    }
  }
  &.btn-icon {
    column-gap: 0.3rem;
  }
}
</style>
