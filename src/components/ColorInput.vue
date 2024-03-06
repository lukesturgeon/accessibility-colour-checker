<script setup>
import { ref, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

defineProps({
  id: String,
});

const color = defineModel();
const input = ref(null);

function updateColor(event) {
  color.value = event.target.value;
}

const isEmpty = computed(() => {
  return color.value == undefined;
});

const previewColor = computed(() => {
  if (!color.value) {
    return "#e9e9e9";
  }
  return color.value;
});

const textColor = computed(() => {
  if (color.value) {
    let color1 = new Color(color.value);
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
    <img v-show="isEmpty" class="add-icon" src="/add-icon.svg" alt="+ icon" />

    <div v-show="!isEmpty" class="hex-label">
      <span :style="{ color: textColor }">{{ color }}</span>
    </div>

    <input
      type="color"
      ref="input"
      :id="id"
      :name="id"
      :value="previewColor"
      @change="updateColor"
    />
  </div>
</template>

<style>
.color-input {
  position: relative;
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

input[type="color"] {
  border: none;
  background-color: #e9e9e9;
  width: 100%;
  block-size: auto;
  aspect-ratio: 1/1;
  border-radius: 0.5rem;
  overflow: hidden;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
}
</style>
