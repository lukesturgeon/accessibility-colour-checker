<script setup>
defineProps({
  heading: String,
  backgroundColor: String,
  foregroundColor: String,
  ratio: Number,
  threshold: Number,
});
</script>

<template>
  <div class="contrast-result">
    <h4>{{ heading }}</h4>
    <div class="cols">
      <div
        class="preview"
        :style="{ backgroundColor: backgroundColor, color: foregroundColor }"
      >
        <slot />
      </div>
      <div class="result">
        <span v-show="ratio >= threshold"
          ><img src="/safe-icon.svg" alt="tick icon" />Good contrast</span
        >

        <span v-show="ratio < threshold"
          ><img src="/not-safe-icon.svg" alt="cross icon" />Bad contrast</span
        >
      </div>
    </div>
  </div>
</template>

<style scoped>
.contrast-result {
  margin-bottom: 1rem;
}

h4 {
  font-size: 1rem;
  font-weight: bold;
}

.cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 1rem;
}

.preview,
.result {
  padding: 1rem 1.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.preview {
  transition: all 0.4s ease;
}

.result {
  /* border: 1px dashed var(--color-checker-dark-grey); */
  background-color: white;
}

.result > span {
  display: flex;
}

img {
  margin-right: 0.5rem;
}
</style>
