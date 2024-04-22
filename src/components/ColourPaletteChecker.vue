<script setup>
import { ref, shallowReactive, computed } from "vue";
import Color from "colorjs.io";
import BigButton from "../components/BigButton.vue";
import ColorInput from "../components/ColorInput.vue";
import ToggleSwitch from "../components/ToggleSwitch.vue";
import ToggleRadio from "../components/ToggleRadio.vue";
import Tooltip from "../components/Tooltip.vue";
import ColorEditor from "./ColorEditor.vue";
import PaletteInput from "./PaletteInput.vue";

const EXPORT_BTN_TEXT = "Export palette as PDF";
const CREATING_BTN_TEXT = "Creating PDF…";

const palette = shallowReactive([]);
const paletteLabels = shallowReactive([]);

const levelAAA = ref(false);
const showResults = ref(false);
const filterResults = ref("all");
const downloadBtnText = ref(EXPORT_BTN_TEXT);

// For the colour editor panel
const editColorIndex = ref(-1);
const editColor = ref();
const editLabel = ref();
const arrowPosition = ref();

const resultFilterOptions = [
  {
    label: "Show all",
    value: "all",
  },
  {
    label: "Large / Safe",
    value: "large",
  },
  {
    label: "Safe only",
    value: "safe",
  },
];

const removeColor = (oldColor) => {
  // locate the index of the old hex value
  let i = palette.indexOf(oldColor);

  // if found do an update
  if (i > -1) {
    palette.splice(i, 1);
  }
};

const checkColors = () => {
  if (palette.length < 2) {
    alert("You need to add at least 2 colours to your palette first");
    return;
  }
  showResults.value = true;

  setTimeout(() => {
    // scroll user down
    const element = document.getElementById("page-results");
    element.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }, 50);
};

const resultsMatrix = computed(() => {
  let matrix = [];

  // loop through each color in the palette and add
  palette.forEach((backgroundColor) => {
    let results = [];

    // nested loop to compare the background color to each other colour
    palette.forEach((foregroundColor) => {
      // check it is a different colour
      if (backgroundColor != foregroundColor) {
        // get the contrast ratio
        let c1 = new Color(backgroundColor);
        let c2 = new Color(foregroundColor);
        let ratio = c1.contrastWCAG21(c2);
        // get the pass/fail values needed
        let normalTextThreshold = levelAAA.value ? 7 : 4.5;
        let largeTextThreshold = levelAAA.value ? 4.5 : 3;

        // skip this result if we are ONLY showing safe AND this is NOT safe
        if (filterResults.value == "safe" && ratio < normalTextThreshold) {
          return;
        }

        // skip this result if we are ONLY showing LARGE
        if (filterResults.value == "large" && ratio < largeTextThreshold) {
          return;
        }

        // add the colour being tested to the data
        let result = { color: foregroundColor };

        // add the contrast ratio to the data
        result.ratio = ratio;

        if (ratio >= normalTextThreshold) {
          result.result = "safe";
          result.label = (levelAAA.value ? "AAA" : "AA") + " Safe";
        } else if (ratio >= largeTextThreshold) {
          result.result = "large-only";
          result.label = "Large only";
        } else {
          result.result = "not-safe";
          result.label = "Not " + (levelAAA.value ? "AAA" : "AA") + " Safe";
        }

        // add the result
        results.push(result);
      }
    });

    matrix.push({ color: backgroundColor, results: results });
  });

  return matrix;
});

async function downloadPdf() {
  downloadBtnText.value = CREATING_BTN_TEXT;

  const functionBase = "/.netlify/functions/make-pdf";

  const url = import.meta.env.PROD
    ? "https://accessibility-colour-checker.netlify.app" + functionBase
    : functionBase;

  const options = {
    method: "POST", // or 'PUT'
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ palette: palette, levelAAA: levelAAA.value }),
  };

  const res = await fetch(url, options)
    .then((res) => {
      if (!res.ok) {
        alert(
          "There was a problem creating the pdf, try again later or contact us"
        );
        console.warn(res);
        return;
      }
      return res.blob();
    })
    .then((blob) => {
      downloadBtnText.value = EXPORT_BTN_TEXT;
      // open pdf
      // var file = window.URL.createObjectURL(blob);
      // window.open(file, "_blank", "name=value");

      var filename = "accessible-colour-palette-WCAG-";
      filename += levelAAA.value ? "AAA" : "AA";
      filename += ".pdf";

      //Check the Browser type and download the File.
      var isIE = false || !!document.documentMode;
      if (isIE) {
        window.navigator.msSaveBlob(blob);
      } else {
        var url = window.URL || window.webkitURL;
        var link = url.createObjectURL(blob);
        // window.open(link, "_blank");
        var aDom = document.createElement("a");
        aDom.setAttribute("style", "display:none");
        aDom.setAttribute("href", link);
        aDom.setAttribute("download", filename);
        document.body.appendChild(aDom);
        aDom.click();
        URL.revokeObjectURL(link);
        document.body.removeChild(aDom);
      }
    })

    .catch((error) => {
      alert(
        "There was a problem creating the pdf, try again later or contact us"
      );
      console.warn(error);
      return;
    });
}

function openNewColor() {
  const grid = document.getElementById("grid-list");
  const gridComputedStyle = window.getComputedStyle(grid);
  const gridColumnCount = gridComputedStyle
    .getPropertyValue("grid-template-columns")
    .split(" ").length;

  const gridItemWidth = 98 / gridColumnCount;

  editColorIndex.value = -1;
  editColor.value = "";
  arrowPosition.value =
    gridItemWidth / 2 + gridItemWidth * (palette.length % gridColumnCount);
}

function openEditColor(c) {
  editColorIndex.value = palette.indexOf(c);
  editLabel.value = paletteLabels[editColorIndex.value];
  editColor.value = c;
}

function cancelEditColor() {
  editColor.value = null;
  editLabel.value = null;
  arrowPosition.value = null;
}

function saveColorChanges(newColor) {
  if (editColorIndex.value == -1) {
    if (palette.indexOf(newColor) > -1) {
      alert("You already have '" + newColor + "' in your palette");
      return;
    }
    // add a new colour
    palette.push(newColor);
    paletteLabels.push("");
  } else {
    // update an existing colour
    palette[editColorIndex.value] = newColor;
    paletteLabels[editColorIndex.value] = editLabel.value;
  }

  editColor.value = null;
  editLabel.value = null;
  arrowPosition.value = null;
}
</script>

<template>
  <p class="page-text">
    Use this to check all colours within a palette against each other. You can
    either check to WCAG 2.2 AA, or AAA guidance.
  </p>

  <div class="page-content">
    <div class="page-colours">
      <div class="page-colours-header">
        <h3>Create your palette</h3>

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
      </div>

      <ul class="palette-list" id="grid-list">
        <li v-for="(color, i) in palette" :key="i">
          <PaletteInput
            :color="color"
            :label="paletteLabels[i]"
            @edit-color="openEditColor"
            @remove-color="removeColor"
          />
        </li>

        <li><ColorInput @edit-color="openNewColor" /></li>
      </ul>

      <ColorEditor
        v-model:editColor="editColor"
        v-model:editLabel="editLabel"
        @cancelEditColor="cancelEditColor"
        @saveEditColor="saveColorChanges"
        :arrowPosition="arrowPosition"
      />

      <div class="check-btn">
        <BigButton @click="checkColors">Check colours</BigButton>
      </div>
    </div>

    <div class="page-results" id="page-results">
      <div v-if="!showResults" class="no-results">
        <p>🎨</p>
        <p>
          Pick your colours in the panel above. Hit check colours, and see if
          your combination will be accessible.
        </p>
      </div>

      <div v-if="showResults">
        <header class="results-header">
          <h3>{{ levelAAA ? "AAA" : "AA" }} compliant results</h3>

          <ToggleRadio v-model="filterResults" :options="resultFilterOptions" />
        </header>

        <ul class="result-list">
          <li
            v-for="(backgroundColor, i) in resultsMatrix"
            :key="backgroundColor.color"
          >
            <h4>
              <span v-if="paletteLabels[i]">
                {{ paletteLabels[i] }} ({{ backgroundColor.color }})</span
              >
              <span v-else>{{ backgroundColor.color }}</span>
            </h4>

            <ul v-if="backgroundColor.results.length > 0">
              <li
                v-for="foregroundColor in backgroundColor.results"
                :key="foregroundColor.color"
                :class="foregroundColor.result"
                :title="`Contrast ratio: ` + foregroundColor.ratio.toFixed(2)"
              >
                <div
                  class="result-list-preview"
                  :style="{ backgroundColor: backgroundColor.color }"
                >
                  <span :style="{ color: foregroundColor.color }">{{
                    foregroundColor.color
                  }}</span>
                </div>

                <div class="result-list-score">
                  {{ foregroundColor.label }}
                </div>
              </li>
            </ul>

            <p v-else class="no-safe-results">
              There are no {{ levelAAA ? "AAA" : "AA" }} compliant results for
              this colour.
            </p>
          </li>
        </ul>

        <div class="export">
          <BigButton @click="downloadPdf()">{{ downloadBtnText }}</BigButton>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
/* .page-text & .page-content is loaded globally */

.page-colours {
  border-radius: 0.5rem 0.5rem 0 0;
  /* padding: 1rem; */
  background-color: white;
}

.page-colours-header {
  justify-content: space-between;
  margin: 1rem 1rem 3rem 1rem;
}

.page-colours-header h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.compliance-toggle {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  column-gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.compliance-toggle-text {
  font-weight: bold;
  font-size: 1rem;
  line-height: 1rem;
  text-wrap: pretty;
  width: 60%;
}

.compliance-toggle-switch {
  width: 40%;
}

.check-btn {
  margin: 2rem 1rem 2rem 1rem;
}

.palette-list,
.result-list ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 0;
}

.palette-list {
  margin-inline: 1rem;
}

.no-safe-results {
  margin-bottom: 2rem;
}

.page-results {
  display: flex;
  flex-direction: column;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 2rem;
  background-color: #f3f3f3;
}

.no-results {
  /* width: 75%; */
  max-width: 50ch;
  margin-inline: auto;
  padding: 3rem;
  text-align: center;
}

.results-header {
  /* display: flex; */
  justify-content: space-between;
}

.results-header h3 {
  text-align: center;
  margin-bottom: 1rem;
}

.result-list {
  list-style: none;
  margin-top: 3rem;
}

.result-list h4 {
  font-size: 1rem;
  font-weight: bold;
}

.result-list-preview {
  aspect-ratio: 1/1;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.4s ease;
}

.result-list-score {
  display: flex;
  column-gap: 0.25rem;
  background-color: white;
  border-radius: 0 0 0.5rem 0.5rem;
  padding: 0.25rem 0 0.25rem 0.3rem;
  font-size: 1rem;
}

.result-list-score::before,
.result-list-score::after {
  display: block;
}

.safe .result-list-score::before {
  margin-top: 2px;
  content: url("/safe-icon.svg");
}

.large-only .result-list-score::before {
  padding-left: 4px;
  content: url("/large-only-icon.svg");
}

.not-safe .result-list-score::before {
  margin-top: 2px;
  content: url("/not-safe-icon.svg");
}

.export {
  border-top: 2px solid var(--color-checker-dark-grey);
  padding-top: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2rem;
}

.download-btn {
  display: inline-block;
  background-color: white;
  padding: 1rem;
  cursor: pointer;
  position: relative;
}

.download-btn img {
  width: 24px;
  display: none;
  position: absolute;
  left: calc(50% - 12px);
  top: calc(50% - 12px);
}

.download-btn.loading img {
  display: inline;
}
.download-btn.loading span {
  opacity: 0;
}

@media (min-width: 768px) {
  .page-colours-header {
    margin: 2rem 2rem 3rem 2rem;
  }

  .page-colours-header,
  .results-header {
    display: flex;
  }

  .palette-list,
  .result-list ul {
    grid-template-columns: repeat(4, 1fr);
  }

  .palette-list {
    margin-inline: 2rem;
  }

  .check-btn {
    margin-inline: 2rem;
  }
}

@media (min-width: 992px) {
  .page-colours-header h3,
  .results-header h3 {
    text-align: left;
    margin-bottom: unset;
  }

  .palette-list,
  .result-list ul {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>
