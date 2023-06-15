<script import lang="ts">
import type { TileProperties } from '@/modules/TileProperties.mjs'
import { TileStatus, TileType } from '@/modules/TileEnums.mjs'
import { computed } from 'vue'
</script>

<script setup lang="ts">
// star count to color
/**
 * https://i.redd.it/85h4esk1hew41.jpg
 * 1 - blue
 * 2 - green
 * 3 - red
 * 4 - dark blue
 * 5 - maroon
 * 6 - teal/turquiose
 * 7 - black
 * 8 - grey
 */

const starCountToColor = [
  'blue', // 1
  'green', // 2
  'red', // 3
  'darkblue', // 4
  'maroon', // 5
  'turquiose', // 6
  'black', // 7
  'gray' // 8
]

const props = defineProps<{
  tileProps: TileProperties
}>()
const { tileProps } = props

const classObject = computed(() => ({
  opened: tileProps.tileStatus === TileStatus.Opened,
  unopened:
    tileProps.tileStatus === TileStatus.Unopened || tileProps.tileStatus === TileStatus.Flagged,
  flagged: tileProps.tileStatus === TileStatus.Flagged
}))

const styleObject = computed(() => ({
  color:
    tileProps.tileStatus === TileStatus.Opened ? starCountToColor[tileProps.starCount - 1] : 'unset'
}))

const emit = defineEmits({
  tileClick: (tileCoordinates: string) => {
    if (tileCoordinates) {
      return true
    } else {
      return false
    }
  },
  tileRightClick: (tileCoordinates: string) => {
    if (tileCoordinates) {
      return true
    } else {
      return false
    }
  }
})

function buttonClick(tileProps: TileProperties) {
  if (tileProps.tileStatus !== TileStatus.Flagged) {
    emit('tileClick', tileProps.coordinates)
  }
}

function buttonMiddleDown() {}

function buttonMiddleUp() {}

function buttonRightClick(tileCoordinates: string) {
  emit('tileRightClick', tileCoordinates)
}
</script>

<template>
  <button
    @click.left="buttonClick(tileProps)"
    @mousedown.middle.prevent="buttonMiddleDown()"
    @mouseup.middle.prevent="buttonMiddleUp()"
    @click.right.prevent="buttonRightClick(tileProps.coordinates)"
    class="tile"
    :class="classObject"
    :style="styleObject"
  >
    <span
      v-if="tileProps.tileStatus === TileStatus.Opened && tileProps.tileType === TileType.Adjacent"
    >
      {{ tileProps.starCount }}
    </span>
    <svg
      v-else-if="tileProps.tileStatus === TileStatus.Opened && tileProps.tileType === TileType.Star"
      viewBox="0 0 24 24"
    >
      <path
        d="M12.0008 17L6.12295 20.5902L7.72105 13.8906L2.49023 9.40983L9.35577 8.85942L12.0008 2.5L14.6458 8.85942L21.5114 9.40983L16.2806 13.8906L17.8787 20.5902L12.0008 17Z"
      ></path>
    </svg>
    <svg v-else-if="tileProps.tileStatus === TileStatus.Flagged" viewBox="0 0 24 24">
      <path
        d="M3 3H12.382C12.7607 3 13.107 3.214 13.2764 3.55279L14 5H20C20.5523 5 21 5.44772 21 6V17C21 17.5523 20.5523 18 20 18H13.618C13.2393 18 12.893 17.786 12.7236 17.4472L12 16H5V22H3V3Z"
      ></path>
    </svg>
  </button>
</template>

<style lang="scss">
.tile {
  border-radius: 0;
  border-width: 1px;
  border-style: inset;
  border-color: wheat;
  font-weight: 500;
  font-size: 1.25rem;
}

.unopened {
  background-color: darkolivegreen;

  &:not(.flagged):active {
    background-color: olivedrab;
  }
}

.opened {
  background-color: tan;
}
</style>
