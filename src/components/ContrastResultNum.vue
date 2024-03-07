<script setup>
import { computed } from "vue";

import Tooltip from "./Tooltip.vue";

const props = defineProps({
  ratio: Number,
  levelAAA: Boolean,
});

/*
https://www.w3.org/TR/WCAG22/#dfn-contrast-ratio

(Level AAA)
The visual presentation of text and images of text has a contrast ratio of at least 7:1
Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;

(Level AA)
The visual presentation of text and images of text has a contrast ratio of at least 4.5:1
Large-scale text and images of large-scale text have a contrast ratio of at least 3:1;

*/

const resultColor = computed(() => {
  if (
    (props.levelAAA && props.ratio >= 7) ||
    (!props.levelAAA && props.ratio >= 4.5)
  ) {
    // Green
    return "#249000";
  } else if (
    (props.levelAAA && props.ratio >= 4.5) ||
    (!props.levelAAA && props.ratio >= 3)
  ) {
    // Orange
    return "#FF9700";
  }
  // check if passes the highest tests
  // Red
  return "#D50000";
});
</script>

<template>
  <p :style="{ color: resultColor }">
    {{ ratio.toFixed(2) }} : 1
    <Tooltip
      >This is the explanation text for this help arrow. On desktop it should
      appear when you hover, on click for mobile and tablet.</Tooltip
    >
  </p>
</template>

<style scoped>
p {
  font-weight: 100;
  font-size: 3rem;
  text-align: center;
  margin-block: 0.5rem;
  transition: all 0.4s ease;
}
</style>
