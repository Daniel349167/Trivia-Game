<template>
  <div class="outer-container">
    <div class="center-container">
      <h1 class="title">TRIVIA GAME</h1>
      <CategorySelector />
      <DifficultySelector />
      <button @click="startTrivia" class="start-button">Empezar</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tus datos aquí
    };
  },
  methods: {
    startTrivia() {
      // lógica del método aquí
    }
  }
}
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Cambia de center a flex-start para mover el contenido hacia arriba */
  padding-top: 20vh; /* Agrega un pequeño relleno en la parte superior para evitar que el contenido esté demasiado cerca del borde superior */
  min-height: 70vh; /* Retorna a 100vh */
}

/* Media query para pantallas de hasta 767px (móviles) */
@media (max-width: 767px) {
  .outer-container {
    padding-top: 25vh; /* Valor para móviles */
  }
}

.center-container {
  display: flex;
  flex-direction: column;
  gap: 10px; 
  align-items: center;
}

.title {
  font-size: 2em;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30px;
}


.start-button {
  margin-top: 20px;
  background-color: black; /* fondo negro */
  color: white; /* texto en blanco para mejor contraste con el fondo negro */
  padding: 10px 27px; /* Ajusta el padding para cambiar las dimensiones del botón */
  border: none; /* elimina cualquier borde por defecto */
  cursor: pointer; /* muestra un cursor de mano cuando se pasa el ratón sobre el botón */
  transition: 0.3s; /* animación suave al cambiar estados */
  border-radius: 5px; /* Esquinas ligeramente redondeadas */
}

.start-button:hover {
  opacity: 0.8; /* efecto de opacidad al pasar el ratón por encima para una mejor interacción */
}


</style>
