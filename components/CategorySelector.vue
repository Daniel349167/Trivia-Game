<template>
  <div class="center-container">
    <select v-model="selectedCategory" class="form-select">
      <!-- Opción predeterminada para instruir al usuario -->
      <option disabled value="">Selecciona la categoría</option>
      <!-- Opciones reales basadas en la API -->
      <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.name }}</option>
    </select>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      categories: [],
      selectedCategory: '' // Inicializado con una cadena vacía
    }
  },
  async mounted() {
    try {
      const response = await axios.get('https://opentdb.com/api_category.php')
      this.categories = response.data.trivia_categories
    } catch (error) {
      console.error('Error al obtener categorías:', error)
    }
  },
}
</script>

<style scoped>
.center-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.form-select {
  width: 200px;
  height: 40px; /* Aumenta la altura */
  line-height: 40px; /* Establece una línea de altura igual a la altura del select */
  padding: 0 30px 0 10px; /* Establece el padding superior e inferior a 0 */
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="10" height="6"><path fill="black" d="M0 0h10L5 6z"/></svg>') no-repeat;
  background-position: right 10px center;
  display: flex; /* Añade flexbox */
  align-items: center; /* Centra el contenido verticalmente */
  justify-content: space-between; /* Separa el texto y el icono */
  border: 1px solid #ccc; /* Agrega un borde para visualizar mejor el elemento, puedes eliminarlo o ajustarlo según tus necesidades */
  color: #333;
}



</style>

