<script setup>
import { ref, computed } from "vue";
import Color from "colorjs.io";

const props = defineProps({
  color: String,
  label: String,
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

const textLabel = computed(() => {
  return props.label ? props.label : props.color;
});
</script>

<template>
  <div class="color-input">
    <button class="remove-button" @click="$emit('remove-color', color)">
      <img src="/remove-icon.svg" alt="x icon to remove a colour" />
    </button>

    <img v-show="isEmpty" class="add-icon" src="/add-icon.svg" alt="+ icon" />

    <div v-show="!isEmpty" class="hex-label">
      <span class="text-label" :style="{ color: textColor }">{{ label }}</span>
      <span
        class="text-color"
        :class="{ small: label }"
        :style="{ color: textColor }"
        >{{ color }}</span
      >
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

.remove-button {
  position: absolute;
  top: 0;
  outline: none;
  border: none;
  background-color: unset;
  cursor: pointer;
  right: 0;
  transform: translate(5px, -5px);
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.hex-label .text-label {
  display: block;
  text-align: center;
  padding-inline: 0.5em;
}

.hex-label .text-color.small {
  font-size: 0.7em;
}

.hex-label .text-color.small::before {
  content: "(";
}

.hex-label .text-color.small::after {
  content: ")";
}

.color-preview {
  background-color: var(--color-checker-light-grey);
  width: 100%;
  block-size: auto;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
}
</style>
