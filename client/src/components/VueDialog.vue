<script lang="ts" setup>
const emits = defineEmits<{
  (e: 'setDialogRef', dialogElement: HTMLDialogElement): void
  (e: 'closeButton'): void
  (e: 'dialogClosed', event: Event): void
}>()

function setDialogRef(dialogElement: HTMLDialogElement) {
  emits('setDialogRef', dialogElement)
}

function closeButton() {
  emits('closeButton')
}

function dialogClosed(event: Event) {
  emits('dialogClosed', event)
}
</script>

<template>
  <dialog
    @close="dialogClosed($event)"
    :ref="(dialogElement) => setDialogRef(dialogElement as HTMLDialogElement)"
  >
    <slot></slot>
    <slot name="close">
      <button class="btn btn-lightcoral" @click="closeButton()">Close</button>
    </slot>
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
</style>
