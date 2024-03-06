<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import SingleColourChecker from "./components/SingleColourChecker.vue";
import ColourPaletteChecker from "./components/ColourPaletteChecker.vue";

const hash = ref(null);

const components = {
  palette: ColourPaletteChecker,
};

onMounted(() => {
  window.addEventListener("hashchange", setHash);
  setHash();
});

onUnmounted(() => {
  window.removeEventListener("hashchange", setHash);
});

function setHash() {
  hash.value = window.location.hash.substring(1);
}

const activeComponent = computed(() => {
  // check if a match was found for the page has
  if (hash.value in components) {
    return components[hash.value];
  }

  // else - return the default
  return SingleColourChecker;
});

const isSingleActive = computed(() => {
  return !hash || hash.value == "";
});

const isPaletteActive = computed(() => {
  return hash && hash.value == "palette";
});
</script>

<template>
  <div class="bg">
    <nav>
      <a href="#" :class="{ active: isSingleActive }">Single colour checker</a>
      <a href="#palette" :class="{ active: isPaletteActive }"
        >Colour palette checker</a
      >
    </nav>
  </div>

  <div class="active-component">
    <component :is="activeComponent"></component>
  </div>
</template>

<style scoped>
.bg {
  background-color: #3472d8;
}

nav {
  max-width: 1024px;
  margin-inline: auto;
  display: flex;
  column-gap: 0.125rem;
}

nav a {
  flex-grow: 1;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem 0.5rem 0 0;

  font-weight: bold;
  text-decoration: none;
  text-align: center;

  color: black;
  background-color: #99b8eb;
}

nav a.active {
  background-color: #303131;
  color: white;
}

.active-component {
  max-width: 1024px;
  margin-inline: auto;
}
</style>
