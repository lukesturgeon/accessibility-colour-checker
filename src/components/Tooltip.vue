<script setup>
const props = defineProps({
  position: {
    type: String,
    default: "top",
  },
});
</script>

<template>
  <div class="tooltip" :class="position">
    <sup class="tooltip-icon">?</sup>
    <span class="tooltip-text"><slot /></span>
  </div>
</template>

<style scoped>
/*
https://www.w3schools.com/css/css_tooltip.asp
*/

/* Tooltip container */
.tooltip {
  position: relative;
  display: inline-block;
  text-align: center;
  vertical-align: top;
  margin-top: 2%;
  color: black;
}

.tooltip .tooltip-icon {
  display: block;
  width: 1.5em;
  height: 1.5em;
  border: 1px solid #303131;
  border-radius: 50%;
  font-size: x-small;
  font-weight: bold;
}

/* Tooltip text */
.tooltip .tooltip-text {
  visibility: hidden;
  font-weight: 300;
  font-size: 1rem;
  background-color: #d8d8d8;
  text-align: center;
  padding: 0.5rem;
  position: absolute;
  z-index: 1;
}

.tooltip.top .tooltip-text {
  /* Position the tooltip text - top */
  width: 300px;
  bottom: 100%;
  left: 50%;
  margin-left: -150px;
}

.tooltip.right .tooltip-text {
  /* Position the tooltip text - right */
  width: 300px;
  bottom: 0;
  left: 105%;
}

.tooltip.bottom .tooltip-text {
  /* Position the tooltip text - bottom */
  width: 120px;
  top: 100%;
  left: 50%;
  margin-left: -60px;
}

.tooltip.left .tooltip-text {
  /* Position the tooltip text - left */
  top: -5px;
  right: 105%;
}

/* Show the tooltip text when you mouse over the tooltip container */
.tooltip:hover .tooltip-text {
  visibility: visible;
}

/* span {
  width: 1.5em;
  height: 1.5em;
  display: inline-block;
  border: 1px solid #303131;
  border-radius: 50%;
  font-size: x-small;
  text-align: center;
  vertical-align: middle;
} */
</style>
