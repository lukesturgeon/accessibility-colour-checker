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
  background-color: #303131;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
