<script setup>
const model = defineModel();
defineProps({ name: String, id: String });
</script>

<template>
  <div class="toggle-switch">
    <label for="levelAAA" class="switch">
      <input type="checkbox" :name="name" :id="id" v-model="model" />
      <span class="slider"></span
    ></label>
    <div class="toggle-labels"><span>AA</span> <span>AAA</span></div>
  </div>
</template>

<style scoped>
.toggle-switch {
  width: 100%;
  display: flex;
  flex-direction: column;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: left 0.4s;
  border: 2px solid var(--color-checker-dark-grey);
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 2px;
  bottom: 2px;
  background-color: var(--color-checker-dark-grey);
  -webkit-transition: 0.4s;
  transition: 0.4s;
  border-radius: 50%;
}

input:checked + .slider:before {
  left: calc(100% - 26px - 2px);
}

input:focus-visible + .slider {
  border: 2px solid #3372d8;
  box-shadow: 0 0 2px white;
}

.toggle-labels {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1rem;
}
</style>
