<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import GameBoard from './components/GameBoard.vue'
import GameBoardHeader from './components/GameBoardHeader.vue'
</script>

<template>
  <header>
    Starsweeper
    <!--<img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />-->

    <!--<div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>-->
  </header>

  <main>
    <!--<TheWelcome />-->
    <GameBoardHeader />
    <GameBoard />
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
