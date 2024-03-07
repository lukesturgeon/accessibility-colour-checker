<script setup>
import { ref, shallowReactive, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

import BigButton from "../components/BigButton.vue";
import PaletteInput from "../components/PaletteInput.vue";
import ContrastResultPreview from "../components/ContrastResultPreview.vue";
import ContrastResultNum from "../components/ContrastResultNum.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import Tooltip from "../components/Tooltip.vue";

//"#11ac06", "#0ad507", "#cfdd0e"
const palette = shallowReactive([]);
const levelAAA = ref(false);

const onChangeColor = (oldColor, newColor) => {
  // update the value in the array because of a change

  // locate the index of the old hex value
  let i = palette.indexOf(oldColor);

  // if found do an update
  if (i > -1) {
    palette.splice(i, 1, newColor);
  }
};

const onAddColor = (oldColor, newColor) => {
  palette.push(newColor);
};

const checkColors = () => {
  // check background and foreground are valid
  console.log("check dem colours");
};

const normalTextThreshold = computed(() => {
  console.log("normal");
  console.log(levelAAA.value);
  return levelAAA.value ? 7 : 4.5;
});

const largeTextThreshold = computed(() => {
  return levelAAA.value ? 4.5 : 3;
});
</script>

<template>
  <p class="page-text">
    Use this to check all colours within a palette against each other
  </p>

  <div class="page-content">
    <div class="page-colours">
      <div class="page-colours-header">
        <h3>Create your palette</h3>

        <div class="compliance-toggle">
          <b
            >Choose WCAG compliance level
            <Tooltip position="right"
              >This is the explanation text for this help arrow. On desktop it
              should appear when you hover, on click for mobile and
              tablet.</Tooltip
            ></b
          >
          <ToggleSwitch name="levelAAA" id="levelAAA" v-model="levelAAA" />
        </div>
      </div>

      <ul class="palette-list">
        <li v-for="(color, i) in palette" :key="i">
          <PaletteInput :color="color" @color-change="onChangeColor" />
        </li>

        <li><PaletteInput @color-change="onAddColor" /></li>
      </ul>

      <BigButton @click="checkColors">Check colours</BigButton>
    </div>
    <div class="page-results">
      <h3>{{ levelAAA ? "AAA" : "AA" }} compliance results</h3>

      <div class="no-results">
        <div class="no-results-text">
          <p>🎨</p>
          <p>
            Pick your colours in the panel to the left. Hit check colours, and
            see if your combination will be accessible.
          </p>

          <li v-for="(color, i) in palette" :key="i">
            {{ color }}
          </li>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.page-text {
  max-width: 50ch;
  margin-block: 3rem;
  margin-inline: auto;
  padding-inline: 1rem;

  text-align: center;
  color: white;
}

.page-content {
  margin-inline: auto;
  padding-inline: 1rem;
  display: flex;
  flex-direction: column;
  color: black;
}

.page-colours {
  border-radius: 0.5rem 0.5rem 0 0;
  padding: 2rem;
  background-color: white;
}

.page-colours-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 3rem;
}

.compliance-toggle {
  display: flex;
  column-gap: 1rem;
}

.palette-list {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 3rem;
}

.page-results {
  display: flex;
  flex-direction: column;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 2rem;
  background-color: #f3f3f3;
}
</style>
