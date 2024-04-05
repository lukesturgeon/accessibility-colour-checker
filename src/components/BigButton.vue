<template>
  <button><slot></slot></button>
</template>

<style scoped>
button {
  display: block;
  width: 100%;
  padding: 1.6rem 2rem;
  font-weight: bold;
  font-size: inherit;
  color: white;
  background-color: var(--color-checker-dark-grey);
  border: 2px solid var(--color-checker-dark-grey);
  border-radius: 0.5rem;
  cursor: pointer;
}

button:hover {
  background-color: white;
  color: var(--color-checker-dark-grey);
}
</style>
