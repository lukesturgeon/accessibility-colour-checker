<script setup>
import { ref, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

const props = defineProps({
  color: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["colorChange"]);

const input = ref(null);

const isEmpty = computed(() => {
  return !props.color;
});

const previewColor = computed(() => {
  if (!props.color) {
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

const onInputChange = (event) => {
  if (props.color) {
    emit("colorChange", props.color, event.target.value);
  } else {
    emit("colorChange", undefined, event.target.value);
    // clear the input
  }
};
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
      :value="previewColor"
      @change="onInputChange"
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
