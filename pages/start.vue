<template>
  <div class="center-container">
    <select v-model="selectedDifficulty" class="form-select">
      <option value="easy">Fácil</option>
      <option value="medium">Media</option>
      <option value="hard">Difícil</option>
    </select>
    <select v-model="selectedCategory" class="form-select">
      <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
    </select>
  </div>
</template>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
  gap: 10px; /* Esto controla el espacio entre los elementos dentro del contenedor */
}
.form-select {
  margin: 5px; /* Esto controla el margen alrededor de cada elemento select */
}
</style>
