<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'setDialogRef', dialogElement: HTMLDialogElement): void
  (e: 'closeDialog'): void
}>()

function setDialogRef(dialogElement: HTMLDialogElement) {
  emits('setDialogRef', dialogElement)
}

function closeDialog() {
  emits('closeDialog')
}
</script>

<template>
  <dialog :ref="(dialogElement) => setDialogRef(dialogElement as HTMLDialogElement)">
    <slot></slot>
    <button class="dialog-close-button" @click="closeDialog()">Close</button>
  </dialog>
</template>

<style lang="scss">
@use 'sass:color';

dialog {
  flex-direction: column;
  row-gap: 1.5rem;
  padding: 1.5rem;
  border-radius: 0.3rem;
  border: unset;
  margin: auto;
  background-color: honeydew;

  &[open] {
    display: flex;
  }

  &::backdrop {
    background-color: color.scale($color: slategray, $lightness: 20%, $alpha: -40%);
  }
}

.dialog-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  padding: 0.3rem;
  background-color: lightcoral;
  color: lightyellow;
  cursor: pointer;
  user-select: none;
  border-radius: 0.2rem;
  border-color: lightcoral;
}
</style>
