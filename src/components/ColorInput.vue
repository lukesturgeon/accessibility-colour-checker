<script setup>
import { ref, computed } from "vue";
import Color from "colorjs.io";

const props = defineProps({
  color: String,
});

const isEmpty = computed(() => {
  return !props.color || props.color == "";
});

const previewColor = computed(() => {
  if (!props.color || props.color == "") {
    return "#e9e9e9";
  }
  return props.color;
});

const textColor = computed(() => {
  if (props.color) {
    let color1 = new Color(props.color);
    let color2 = new Color("black");
    let contrast = color1.contrast(color2, "Lstar");
    if (contrast < 50) {
      return "white";
    }
  }

  return "black";
});
</script>

<template>
  <div class="color-input">
    <img v-show="isEmpty" class="add-icon" src="/colour-checker/add-icon.svg" alt="+ icon" />

    <div v-show="!isEmpty" class="hex-label">
      <span :style="{ color: textColor }">{{ color }}</span>
    </div>

    <div
      class="color-preview"
      :style="{ backgroundColor: previewColor }"
      @click="$emit('edit-color', color)"
    ></div>
  </div>
</template>

<style>
.color-input {
  position: relative;
  cursor: pointer;
}

.add-icon {
  position: absolute;
  top: calc(50% - 15px);
  left: calc(50% - 15px);
  pointer-events: none;
}

.hex-label {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.color-preview {
  background-color: var(--color-checker-light-grey);
  width: 100%;
  block-size: auto;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
}
</style>
