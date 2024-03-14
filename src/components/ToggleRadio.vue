<script setup>
const model = defineModel();
</script>

<template>
  <div class="toggle-radio">
    <label
      ><input type="radio" id="show-all" value="show-all" v-model="model" />
      Show all
    </label>

    <label
      ><input type="radio" id="show-safe" value="show-safe" v-model="model" />
      Safe only</label
    >
  </div>
</template>

<style scoped>
div {
  display: flex;
  column-gap: 3rem;
}
label {
  display: flex;
  align-items: center;
  flex-direction: column;
  font-weight: bold;
  font-size: 1rem;
}
input[type="radio"] {
  display: grid;
  place-content: center;
  height: 34px;
  width: 34px;
  /* Add if not using autoprefixer */
  -webkit-appearance: none;
  appearance: none;
  /* For iOS < 15 to remove gradient background */
  background-color: #fff;
  /* Not removed via appearance */
  margin: 0;
  border: 2px solid var(--color-checker-dark-grey);
  border-radius: 50%;
  background-color: unset;
}

input[type="radio"]::before {
  content: "";
  width: 26px;
  height: 26px;
  background-color: var(--color-checker-dark-grey);
  border-radius: 50%;
  transform: scale(0);
  transition: 0.2s transform ease-in-out;
  box-shadow: inset 1em 1em var(--form-control-color);
}

input[type="radio"]:checked::before {
  transform: scale(1);
}
</style>
