<script setup>
import { ref, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

import BigButton from "../components/BigButton.vue";
import ColorInput from "../components/ColorInput.vue";
import ContrastResultPreview from "../components/ContrastResultPreview.vue";
import ContrastResultNum from "../components/ContrastResultNum.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";

const backgroundColor = ref("#ff0000");
const foregroundColor = ref();
const contrastRatio = ref(null);
const levelAAA = ref(false);

const toggleColors = () => {
  let tempForeground = foregroundColor.value;
  foregroundColor.value = backgroundColor.value;
  backgroundColor.value = tempForeground;
};

const onColorChange = () => {
  // have we already started checking?
  if (contrastRatio.value != undefined) {
    checkColors();
  }
};

const checkColors = () => {
  // check background and foreground are valid
  if (!backgroundColor.value) {
    alert("You must set a background colour before you can check");
    return;
  }

  if (!foregroundColor.value) {
    alert("You must set a foreground colour before you can check");
    return;
  }

  // check contract of colours
  let c1 = new Color(backgroundColor.value);
  let c2 = new Color(foregroundColor.value);
  contrastRatio.value = c1.contrastWCAG21(c2);
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
    Check 2 colours against each other for accessibility compliance. You can
    either check to WCAG 2.2 AA, or AAA guidance.
  </p>

  <div class="page-content">
    <div class="page-colours">
      <h3>Your Colours</h3>

      <div class="colour-picker-container">
        <div class="colour-picker-input">
          <label for="backgroundcolor"
            ><h6>
              {{ backgroundColor ? "Background" : "Choose background" }}
            </h6></label
          >
          <ColorInput
            id="backgroundcolor"
            v-model="backgroundColor"
            @change="onColorChange"
          />
        </div>
        <div class="colour-picker-switch">
          <img
            src="/reverse-icon.svg"
            alt="icon with two arrows facing opposite directions, to toggle"
            @click="toggleColors"
          />
        </div>
        <div class="colour-picker-input">
          <label for="foregroundcolor"
            ><h6>
              {{ foregroundColor ? "Foreground" : "Choose foreground" }}
            </h6></label
          >
          <ColorInput
            id="foregroundcolor"
            v-model="foregroundColor"
            @change="onColorChange"
          />
        </div>
      </div>

      <div class="compliance-toggle">
        <b>Choose WCAG compliance level</b>
        <ToggleSwitch name="levelAAA" id="levelAAA" v-model="levelAAA" />
      </div>

      <BigButton @click="checkColors">Check colours</BigButton>
    </div>
    <div class="page-compliance">
      <h3>{{ levelAAA ? "AAA" : "AA" }} compliance results</h3>

      <div v-if="!contrastRatio" class="no-results">
        <div>
          <p>🎨</p>
          <p>
            Pick your colours in the panel to the left. Hit check colours, and
            see if your combination will be accessible.
          </p>
        </div>
      </div>

      <template v-else>
        <ContrastResultNum :ratio="contrastRatio" :levelAAA="levelAAA" />

        <ContrastResultPreview
          heading="Normal text"
          :backgroundColor="backgroundColor"
          :foregroundColor="foregroundColor"
          :ratio="contrastRatio"
          :threshold="normalTextThreshold"
          ><span style="font-size: small"
            >This is how your foreground colourwill appear with normal
            text</span
          ></ContrastResultPreview
        >

        <ContrastResultPreview
          heading="Large text"
          :backgroundColor="backgroundColor"
          :foregroundColor="foregroundColor"
          :ratio="contrastRatio"
          :threshold="largeTextThreshold"
          ><span style="font-size: large"
            >This is how your foreground colour will appear with large
            text</span
          ></ContrastResultPreview
        >

        <ContrastResultPreview
          heading="Icons"
          :backgroundColor="backgroundColor"
          :foregroundColor="foregroundColor"
          :ratio="contrastRatio"
          :threshold="largeTextThreshold"
          ><span style="font-size: xx-large"
            >&#9728; &#9729; &#9730; &#9731;</span
          ></ContrastResultPreview
        >
      </template>
    </div>
  </div>
</template>
<style scoped>
.page-text {
  width: 48ch;
  margin-block: 3rem;
  margin-inline: auto;

  text-align: center;
  color: white;
}
.page-content {
  /* max-width: 1024px; */
  margin-inline: auto;
  display: flex;

  color: black;
}

.page-colours {
  width: 40%;
  padding: 2rem;
  border-radius: 0.5rem 0 0 0.5rem;
  background-color: white;
}

.page-colours h3 {
  margin-bottom: 5.3rem;
}

h3 {
  text-align: center;
}

.colour-picker-container {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
}

h6 {
  margin-bottom: 0.5rem;
}

.colour-picker-container .colour-picker-input {
  width: 40%;
  text-align: center;
}

.colour-picker-container .colour-picker-switch {
  flex-grow: 1;
  padding-top: 0.75rem;
}

.colour-picker-container .colour-picker-switch img {
  margin-inline: auto;
  cursor: pointer;
}

.compliance-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  column-gap: 1rem;
  margin-bottom: 2rem;
}

.compliance-toggle > * {
  width: 40%;
}

.page-compliance {
  display: flex;
  flex-direction: column;
  width: 60%;
  padding: 2rem;
  border-radius: 0 0.5rem 0.5rem 0;
  background-color: #f3f3f3;
}

.no-results {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-bottom: 4rem;
}

.no-results p {
  width: 75%;
  max-width: 40ch;
  margin-inline: auto;
}
</style>
