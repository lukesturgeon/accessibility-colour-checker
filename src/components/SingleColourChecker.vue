<script setup>
import { ref, computed } from "vue";
import Color from "https://colorjs.io/dist/color.js";

import BigButton from "../components/BigButton.vue";
import ColorInput from "../components/ColorInput.vue";
import ContrastResultPreview from "../components/ContrastResultPreview.vue";
import ContrastResultNum from "../components/ContrastResultNum.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import Tooltip from "../components/Tooltip.vue";

const backgroundColor = ref();
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

      <BigButton @click="checkColors">Check colours</BigButton>
    </div>
    <div class="page-compliance">
      <h3>{{ levelAAA ? "AAA" : "AA" }} compliance results</h3>

      <div v-if="!contrastRatio" class="no-results">
        <div class="no-results-text">
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

.page-colours h3 {
  margin-bottom: 1rem;
  text-align: center;
  /* margin-bottom: 5.3rem; */
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
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 2rem;
  background-color: #f3f3f3;
}

.page-compliance h3 {
  text-align: center;
}

.no-results {
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.no-results .no-results-text {
  width: 75%;
  max-width: 40ch;
  margin-inline: auto;
}

@media screen and (min-width: 769px) {
  .page-content {
    flex-direction: row;
  }
  .page-colours {
    width: 40%;
    border-radius: 0.5rem 0 0 0.5rem;
  }

  .page-colours .colour-picker-container {
    margin-top: 5.2rem;
  }

  .page-compliance {
    width: 60%;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .page-compliance .no-results {
    padding-bottom: 4rem;
  }
}

@media screen and (min-width: 1056px) {
  .page-content {
    padding-inline: 0;
  }
}
</style>
