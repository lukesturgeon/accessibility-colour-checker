<template>
  <button><slot></slot></button>
</template>

<style scoped>
button {
  display: block;
  width: 100%;
  padding: 2rem;
  font-weight: bold;
  font-size: inherit;
  color: white;
  background-color: var(--color-checker-dark-grey);
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
