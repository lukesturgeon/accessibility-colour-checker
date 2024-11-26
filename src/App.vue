<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

import SingleColourChecker from "./components/SingleColourChecker.vue";
import ColourPaletteChecker from "./components/ColourPaletteChecker.vue";

const activeComponentKey = ref("single");

const components = {
  single: SingleColourChecker,
  palette: ColourPaletteChecker,
};

console.log('Colour Checker v1.0.0');
</script>

<template>
  <div class="bg">
    <nav>
      <a
        @click="activeComponentKey = 'single'"
        :class="{ active: activeComponentKey == 'single' }"
        >Single colour checker</a
      >
      <a
        @click="activeComponentKey = 'palette'"
        :class="{ active: activeComponentKey == 'palette' }"
        >Colour palette checker</a
      >
    </nav>
  </div>

  <div class="active-component">
    <KeepAlive>
      <component :is="components[activeComponentKey]"></component>
    </KeepAlive>
  </div>
</template>

<style scoped>
.bg {
  background-color: var(--sn-blue);
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
  cursor: pointer;

  font-weight: bold;
  text-decoration: none;
  text-align: center;

  color: black;
  background-color: var(--sn-light-blue);
}

nav a.active {
  background-color: var(--color-checker-dark-grey);
  color: white;
}

.active-component {
  max-width: 1024px;
  margin-inline: auto;
}
</style>
