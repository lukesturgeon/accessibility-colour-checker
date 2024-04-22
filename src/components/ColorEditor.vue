<script setup>
import { ref, computed, watch } from "vue";
import Color from "colorjs.io";
import colorString from "color-string";

const editColor = defineModel("editColor");
const editName = defineModel("editLabel");
const props = defineProps(["arrowPosition"]);

const isActive = ref(false);

const emit = defineEmits(["cancelEditColor", "saveEditColor"]);

// HSL
const hsl = ref([50, 50, 50]);

watch(editColor, (newValue, prevValue) => {
  if (newValue != null) {
    if (newValue == "") {
      isActive.value = true;
    } else {
      // get HSL from new colour
      let color = new Color(newValue).to("hsl");
      if (!color.hsl[0]) {
        color.set("h", 0);
      }
      hsl.value = [color.hsl[0], color.hsl[1], color.hsl[2]];
      isActive.value = true;
    }
  } else {
    isActive.value = false;
  }
});

const canEditName = computed(() => {
  return editName.value != null;
});

const colorPreview = computed(() => {
  return (
    "hsl(" + hsl.value[0] + ", " + hsl.value[1] + "%, " + hsl.value[2] + "%)"
  );
});

const huePreview = computed(() => {
  let s = hsl.value[1];
  let l = hsl.value[2];
  let color1 = new Color("hsl", [0, 50, 50]);
  let color2 = new Color("hsl", [360, 50, 50]);
  let interpolationOptions = { space: "hsl", steps: 10 };
  interpolationOptions.hue = "raw";
  let steps = Color.steps(color1, color2, interpolationOptions);
  return steps.map((c) => c.display()).join(", ");
});

const saturationPreview = computed(() => {
  let color1 = new Color("hsl", [hsl.value[0], 0, hsl.value[2]]);
  let color2 = new Color("hsl", [hsl.value[0], 100, hsl.value[2]]);
  let interpolationOptions = { space: "hsl", steps: 10 };
  interpolationOptions.hue = "raw";
  let steps = Color.steps(color1, color2, interpolationOptions);
  return steps.map((c) => c.display()).join(", ");
});

const lightnessPreview = computed(() => {
  let color1 = new Color("hsl", [hsl.value[0], hsl.value[1], 0]);
  let color2 = new Color("hsl", [hsl.value[0], hsl.value[1], 100]);
  let interpolationOptions = { space: "hsl", steps: 10 };
  interpolationOptions.hue = "raw";
  let steps = Color.steps(color1, color2, interpolationOptions);
  return steps.map((c) => c.display()).join(", ");
});

const srgbPreview = computed(() => {
  // return [r,g.b] array
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]);

  return [
    Math.round(color.srgb.r * 255),
    Math.round(color.srgb.g * 255),
    Math.round(color.srgb.b * 255),
  ];
});

const hexPreview = computed(() => {
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]).to(
    "srgb"
  );
  const r = color.r * 255;
  const g = color.g * 255;
  const b = color.b * 255;
  return colorString.to.hex([r, g, b]);
});

function setRed(event) {
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]);
  color.srgb.r = event.target.value / 255;
  hsl.value = [color.hsl[0], color.hsl[1], color.hsl[2]];
}

function setGreen(event) {
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]);
  color.srgb.g = event.target.value / 255;
  hsl.value = [color.hsl[0], color.hsl[1], color.hsl[2]];
}

function setBlue(event) {
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]);
  color.srgb.b = event.target.value / 255;
  hsl.value = [color.hsl[0], color.hsl[1], color.hsl[2]];
}

function setHex(event) {
  let value = event.target.value.toString();

  if (!value.startsWith("#")) {
    value = "#" + value;
    event.target.value = value;
  }

  let color = new Color(value).to("hsl");
  hsl.value = [color.hsl[0], color.hsl[1], color.hsl[2]];
}

function cancelEditColor() {
  // isActive.value = false;
  emit("cancelEditColor");
}

function saveEditColor() {
  let color = new Color("hsl", [hsl.value[0], hsl.value[1], hsl.value[2]]).to(
    "srgb"
  );

  const r = color.r * 255;
  const g = color.g * 255;
  const b = color.b * 255;

  emit("saveEditColor", colorString.to.hex([r, g, b]));
}
</script>

<template>
  <div v-show="isActive" class="color-editor">
    <div v-if="arrowPosition" class="traingle-box">
      <img
        class="triangle-icon"
        :style="{ left: arrowPosition + '%' }"
        src="/triangle-icon.svg"
        alt="traingle icon pointing up"
      />
    </div>

    <div class="color-editor-content">
      <div
        class="color-preview"
        :style="{ backgroundColor: colorPreview }"
      ></div>

      <fieldset name="hsl">
        <label for="hue">Hue</label>
        <input
          type="range"
          id="hue"
          name="hue"
          min="0"
          max="360"
          v-model.number="hsl[0]"
          :style="`--steps: ${huePreview}`"
        />

        <label for="saturation">Saturation</label>
        <input
          type="range"
          id="saturation"
          name="saturation"
          min="0"
          max="100"
          v-model.number="hsl[1]"
          :style="`--steps: ${saturationPreview}`"
        />

        <label for="lightness">Lightness</label>
        <input
          type="range"
          id="lightness"
          name="lightness"
          min="0"
          max="100"
          v-model.number="hsl[2]"
          :style="`--steps: ${lightnessPreview}`"
        />
      </fieldset>

      <div class="srgb-hex-columms">
        <fieldset name="srgb">
          <span>
            <label for="red">R</label>
            <input
              type="number"
              id="red"
              name="red"
              min="0"
              max="255"
              :value="srgbPreview[0]"
              @change.lazy="setRed"
          /></span>

          <span>
            <label for="green">G</label>
            <input
              type="number"
              id="green"
              name="green"
              min="0"
              max="255"
              :value="srgbPreview[1]"
              @change.lazy="setGreen"
          /></span>

          <span>
            <label for="blue">B</label>
            <input
              type="number"
              id="blue"
              name="blue"
              min="0"
              max="255"
              :value="srgbPreview[2]"
              @change.lazy="setBlue"
          /></span>
        </fieldset>

        <fieldset name="hex">
          <span class="hex-input-span"
            ><label for="hex">Hex</label>
            <input
              type="text"
              id="hex"
              name="hex"
              pattern="/^#([0-9a-f]{6}|[0-9a-f]{3})$/i"
              :value="hexPreview"
              maxlength="7"
              @change.lazy="setHex"
          /></span>
        </fieldset>
      </div>

      <fieldset v-if="canEditName" name="rename">
        <label for="name">Name Colour</label>
        <input type="text" id="name" name="name" v-model="editName" />
      </fieldset>

      <div class="btns">
        <button type="reset" @click="cancelEditColor">Cancel</button>

        <button type="submit" @click="saveEditColor">Save Changes</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* shared layout */

.traingle-box {
  position: relative;
  height: 20px;
}

.triangle-icon {
  position: absolute;
  left: 0;
  height: 20px;
}

.color-editor-content {
  background-color: var(--color-checker-dark-grey);
  padding: 1rem;
  color: white;
}

.color-preview {
  display: block;
  width: 100%;
  max-height: 120px;
  /* aspect-ratio: 1/1; */
  border-radius: 0.5em;
  /* max-width: 140px; */
  margin-bottom: 1rem;
}

fieldset {
  border: none;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.25em;
  text-align: left;
}

input[type="number"],
input[type="text"] {
  background-color: unset;
  border: 1px solid var(--color-checker-mid-grey);
  border-radius: 0.25rem;
  padding: 0.25rem;
  width: 100%;
  color: white;
  text-align: center;
  font-family: "GT America", "Helvetica", "Arial", sans-serif;
  font-weight: 300;
  font-size: 1rem;
}

input[type="range"] {
  display: block;
  height: 1rem;
  border-radius: 0.25rem;
  width: 100%;
  -webkit-appearance: none;
  margin-bottom: 1rem;
  background: linear-gradient(to right, var(--steps));
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  border: 3px solid #ffffff;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 4px;
}

input[type="range"]::-moz-range-thumb,
input[type="range"]::-ms-thumb {
  border: 3px solid #ffffff;
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  cursor: pointer;
}

.btns {
  display: flex;
  column-gap: 1rem;
}

button {
  display: block;
  font-weight: bold;
  font-size: 0.9rem;
  width: 100%;
  font-family: inherit;
  background: var(--color-checker-grey);
  border: 2px solid var(--color-checker-grey);
  color: black;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-checker-dark-grey);
  color: var(--color-checker-grey);
}

button[type="submit"] {
  background-color: white;
  border-color: white;
  color: black;
}

button[type="submit"]:hover {
  background-color: var(--color-checker-dark-grey);
  color: white;
}

/* specialist layout */

.srgb-hex-columms {
  gap: 1rem;
  margin-bottom: 1rem;
}

fieldset[name="srgb"] {
  width: 100%;
  display: flex;
  column-gap: 1rem;
}

fieldset[name="srgb"] span {
  flex-grow: 1;
}

fieldset[name="hex"] {
  width: 100%;
}

/* fieldset[name="srgb"] {
  display: flex;
  column-gap: 1rem;
  margin-bottom: 1rem;
}

.srgb-fields {
  display: flex;
  column-gap: 1rem;
  width: 50%;
} */

/* fieldset[name="srgb"] span {
  text-align: center;
} */

fieldset[name="rename"] {
  margin-bottom: 1rem;
}

@media (min-width: 480px) {
  .srgb-hex-columms {
    display: flex;
  }
}
</style>
