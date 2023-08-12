<template>
  <div class="center-container">
    <!-- Selector de Dificultad -->
    <select v-model="selectedDifficulty" class="form-select">
      <option disabled value="">Selecciona la dificultad</option>
      <option value="easy">Fácil</option>
      <option value="medium">Media</option>
      <option value="hard">Difícil</option>
    </select>

    <!-- Selector de Categoría -->
    <select
      v-model="selectedCategory"
      class="form-select"
    >
      <option disabled value=0>Selecciona la categoría</option>
      <option
        v-for="category in categories"
        :key="category.id"
        :value="category.id"
      >
        {{ category.name }}
      </option>
    </select>
  </div>
</template>
<script>
import axios from "axios";

export default {
  props: {
    modelValueCategory: {
      type: Number,
      default: 0,
    },
    modelValueDifficulty: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      categories: [],
      selectedDifficulty: this.modelValueDifficulty,
      selectedCategory: this.modelValueCategory,
    };
  },
  watch: {
    selectedDifficulty(newValue) {
      this.$emit("update:selectedDifficulty", newValue);
    },
    selectedCategory(newValue) {
      this.$emit("update:selectedCategory", newValue);
    },
  },

  async mounted() {
    try {
      const response = await axios.get("https://opentdb.com/api_category.php");
      this.categories = response.data.trivia_categories;
    } catch (error) {
      console.error("Error al obtener categorías:", error);
    }
  },
};
</script>


<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 10px; 
}

.form-select {
  width: 200px;
  height: 40px;
  line-height: 40px;
  padding: 0 30px 0 10px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path fill="black" d="M0 0h10L5 6z"/></svg>')
    no-repeat;
  background-position: right 10px center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #ccc;
  color: #333;
}
</style>
