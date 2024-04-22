<script setup>
import { ref, isRef, unref, computed } from "vue";
import Color from "colorjs.io";

import BigButton from "../components/BigButton.vue";
import ColorInput from "../components/ColorInput.vue";
import ContrastResultPreview from "../components/ContrastResultPreview.vue";
import ContrastResultNum from "../components/ContrastResultNum.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import Tooltip from "../components/Tooltip.vue";
import ColorEditor from "../components/ColorEditor.vue";

const backgroundColor = ref();
const foregroundColor = ref();
const contrastRatio = ref(null);
const levelAAA = ref(false);

const editColor = ref();
var editColorRef = null;
const arrowPosition = ref();

const toggleColors = () => {
  let tempForeground = foregroundColor.value;
  foregroundColor.value = backgroundColor.value;
  backgroundColor.value = tempForeground;
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
  return levelAAA.value ? 7 : 4.5;
});

const largeTextThreshold = computed(() => {
  return levelAAA.value ? 4.5 : 3;
});

function editBackgroundColor() {
  if (!backgroundColor.value) {
    backgroundColor.value = "";
  }

  editColorRef = backgroundColor;
  editColor.value = backgroundColor.value;
  arrowPosition.value = "17";
}

function editForegroundColor() {
  if (!foregroundColor.value) {
    foregroundColor.value = "";
  }

  editColorRef = foregroundColor;
  editColor.value = foregroundColor.value;
  arrowPosition.value = "73";
}

function cancelEditColor() {
  // clear the ref
  editColor.value = null;
  arrowPosition.value = null;
}

function updateColor(newColor) {
  editColorRef.value = newColor;
  editColor.value = null;
  arrowPosition.value = null;

  // have we already started checking?
  if (contrastRatio.value != undefined) {
    checkColors();
  }
}
</script>

<template>
  <p class="page-text">
    Check 2 colours against each other for accessibility compliance. You can
    either check to WCAG 2.2 AA, or AAA guidance.
  </p>

  <div class="page-content">
    <div class="page-colours">
      <div class="page-padding">
        <h3>Your Colours</h3>

        <div class="colour-picker-container">
          <div class="colour-picker-input">
            <label for="backgroundcolor"><h4>Background</h4></label>
            <ColorInput :color="backgroundColor" @click="editBackgroundColor" />
          </div>
          <div class="colour-picker-switch">
            <img
              src="/reverse-icon.svg"
              alt="icon with two arrows facing opposite directions, to toggle"
              @click="toggleColors"
            />
          </div>
          <div class="colour-picker-input">
            <label for="foregroundcolor"><h4>Foreground</h4></label>
            <ColorInput :color="foregroundColor" @click="editForegroundColor" />
          </div>
        </div>
      </div>

      <ColorEditor
        v-model:editColor="editColor"
        @cancelEditColor="cancelEditColor"
        @saveEditColor="updateColor"
        :arrowPosition="arrowPosition"
      />

      <div class="page-padding">
        <div class="compliance-toggle">
          <p class="compliance-toggle-text">
            Choose WCAG compliance level
            <Tooltip
              href="#how-to-use-our-colour-and-palette-checker"
            ></Tooltip>
          </p>

          <div class="compliance-toggle-switch">
            <ToggleSwitch name="levelAAA" id="levelAAA" v-model="levelAAA" />
          </div>
        </div>

        <BigButton @click="checkColors">Check colours</BigButton>
      </div>
    </div>
    <div class="page-compliance">
      <h3>{{ levelAAA ? "AAA" : "AA" }} compliant results</h3>

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
        >
          <svg
            class="preview-icons"
            width="163px"
            height="36px"
            viewBox="0 0 163 36"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <title>preview-icons</title>
            <g
              id="preview-icons"
              stroke="none"
              stroke-width="1"
              :fill="foregroundColor"
              fill-rule="evenodd"
            >
              <path
                d="M11.927203,0 C11.4725013,0 11.011985,0.0254261774 10.5462356,0.0774342676 C4.77757141,0.723490321 0.276489914,5.57295579 0.0119256351,11.33603 C-0.166582571,15.2268131 1.6778084,18.3426755 4.27460855,20.9413464 L18.6674868,35.2453048 C19.1739384,35.7480497 19.8368027,36 20.5002486,36 C21.1631129,36 21.8265587,35.7480497 22.3324289,35.2453048 L36.7253071,20.9413464 C39.2988488,18.3178272 41.1461471,15.2655302 40.9908973,11.4030627 C40.7588948,5.62727535 36.2694425,0.747182895 30.4926379,0.0820572089 C30.0135149,0.0265819127 29.5402064,0 29.0727126,0 C25.7048966,0 22.6690942,1.39266108 20.5002486,3.62380815 C18.3314029,1.39266108 15.2950191,0 11.927203,0 M29.0727126,2.31147067 C29.4535689,2.31147067 29.8408212,2.33400751 30.2245848,2.37792546 C34.8500987,2.91071945 38.4795718,6.82981797 38.6673833,11.4949437 C38.7761163,14.2149668 37.6335475,16.7009535 35.0693091,19.3181162 L20.6874787,33.6110951 C20.6363102,33.6625253 20.572931,33.6885293 20.5002486,33.6885293 C20.4269846,33.6885293 20.3641869,33.6625253 20.312437,33.6110951 L5.9247919,19.3123375 C3.34776139,16.7333141 2.20693696,14.2323028 2.33543961,11.441202 C2.54883541,6.78936723 6.1905191,2.89164981 10.8067297,2.37445825 C11.180027,2.33285178 11.556813,2.31147067 11.927203,2.31147067 C14.5472616,2.31147067 16.9981153,3.34816527 18.8273883,5.2297024 C19.2658091,5.68043918 19.8693645,5.93527882 20.5002486,5.93527882 C21.1305511,5.93527882 21.734688,5.68043918 22.1725274,5.2297024 C24.0023819,3.34816527 26.4526541,2.31147067 29.0727126,2.31147067"
                id="Fill-3"
              ></path>
              <rect id="Rectangle" x="64" y="4" width="36" height="3"></rect>
              <rect
                id="Rectangle-Copy-13"
                x="64"
                y="16"
                width="36"
                height="3"
              ></rect>
              <rect
                id="Rectangle-Copy-14"
                x="64"
                y="28"
                width="36"
                height="3"
              ></rect>
              <rect
                id="Rectangle"
                transform="translate(147.1213, 18.6213) rotate(-315) translate(-147.1213, -18.6213)"
                x="126.12132"
                y="17.1213203"
                width="42"
                height="3"
              ></rect>
              <rect
                id="Rectangle"
                transform="translate(147.1213, 18.6213) rotate(-45) translate(-147.1213, -18.6213)"
                x="126.12132"
                y="17.1213203"
                width="42"
                height="3"
              ></rect>
            </g>
          </svg>
        </ContrastResultPreview>
      </template>
    </div>
  </div>
</template>

<style>
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

  display: flex;
  flex-direction: column;
  color: black;
  margin-bottom: 40px;
  box-shadow: 0 0 30px;
}

.page-padding {
  padding: 1rem;
}

/* @media (min-width: 768px) {
  .page-content {
    padding-inline: 1rem;
  }
} */
</style>

<style scoped>
.page-text {
  max-width: 50ch;
  margin-block: 3rem;
  margin-inline: auto;
  padding-inline: 1rem;

  text-align: center;
  color: white;
}

.page-colours {
  border-radius: 0.5rem 0.5rem 0 0;
  /* padding: 1rem; */
  background-color: white;
  text-align: center;
}

.colour-picker-container {
  display: flex;
  align-items: center;
}

h4 {
  font-size: 1rem;
  line-height: 1rem;
  font-weight: bold;
}

.colour-picker-container .colour-picker-input {
  width: 40%;
  text-align: center;
  position: relative;
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
  align-items: flex-start;
  column-gap: 1rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  text-align: left;
}

.compliance-toggle-text {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1.2rem;
  text-wrap: pretty;
  width: 60%;
}

.compliance-toggle-switch {
  width: 40%;
}

/* .compliance-toggle > * {
  width: 40%;
} */

.page-compliance {
  display: flex;
  flex-direction: column;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 1rem;
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

.preview-icons {
  width: 100%;
}

#preview-icons path,
#preview-icons rect {
  transition: fill 0.4s ease;
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
    margin-top: 4.7rem;
  }

  .page-compliance {
    width: 60%;
    border-radius: 0 0.5rem 0.5rem 0;
  }

  .page-compliance .no-results {
    padding-bottom: 4rem;
  }
}

@media (min-width: 768px) {
  .page-compliance {
    padding: 2rem;
  }
}

@media screen and (min-width: 1056px) {
  .page-content {
    padding-inline: 0;
  }
}
</style>
