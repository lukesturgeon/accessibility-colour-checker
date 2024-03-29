<script setup>
import { ref, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

const props = defineProps({
  color: {
    type: String,
    required: false,
  },
});

const emit = defineEmits(["colorChange", "colorAdd", "colorRemove"]);

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
    emit("colorAdd", event.target.value);
    // clear the input
    event.target.value = "#e9e9e9";
  }
};

const onRemove = () => {
  emit("colorRemove", props.color);
};
</script>

<template>
  <div class="color-input" :class="{ hidden: !props.color }">
    <button v-if="props.color" class="remove-button" @click="onRemove">
      <img src="/remove-icon.svg" alt="x icon to remove a colour" />
    </button>

    <img v-show="isEmpty" class="add-icon" src="/add-icon.svg" alt="+ icon" />

    <div v-show="!isEmpty" class="hex-label">
      <span :style="{ color: textColor }">{{ color }}</span>
    </div>

    <input
      type="color"
      ref="input"
      :value="previewColor"
      @change.lazy="onInputChange"
    />
  </div>
</template>

<style>
.color-input {
  position: relative;
  border-radius: 0.5rem;
  overflow: hidden;
}

.remove-button {
  position: absolute;
  top: 0;
  outline: none;
  border: none;
  background-color: unset;
  cursor: pointer;
}

.remove-button {
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
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

input[type="color"] {
  border: none;
  background-color: var(--color-checker-light-grey);
  width: 100%;
  block-size: auto;
  aspect-ratio: 1/1;
}

.color-input.hidden {
  background-color: var(--color-checker-light-grey);
  height: min-content;
}
.color-input.hidden input[type="color"] {
  opacity: 0;
}

input[type="color"]::-webkit-color-swatch-wrapper {
  padding: 0;
}

input[type="color"]::-webkit-color-swatch {
  border: none;
}

@media (hover: hover) {
  .remove-button {
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  .color-input:hover .remove-button {
    opacity: 1;
  }
}
</style>
