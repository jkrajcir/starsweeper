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
    <button @click="closeDialog()">close</button>
  </dialog>
</template>

<style lang="scss"></style>
