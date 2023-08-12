<template>
  <div class="score-view">
    <div class="trophy-icon">
      <!-- Aquí puedes agregar tu icono o imagen de trofeo. 
           Por ejemplo, usando Font Awesome: -->
      <i class="fas fa-trophy"></i>
    </div>
    <h2>Felicitaciones hicistes {{ score }} puntos</h2>
    <div class="button-group">
      <button class="play-again" @click="goToIndex">Volver a jugar</button>
      <button class="share">Compartir</button>
    </div>
  </div>
</template>

<script>
import confetti from "canvas-confetti";
export default {
  data() {
    return {
      score: 0,
      confettiInterval: null,
    };
  },
  async fetch({ params }) {
    this.score = params.score || 0;
  },
  beforeDestroy() {
    if (this.confettiInterval) {
      clearInterval(this.confettiInterval); // Limpiar el intervalo
    }
  },
  mounted() {
    this.score = parseInt(this.$route.query.score) || 0;
    this.launchConfetti();
  },

  methods: {
    launchConfetti() {
      // Lanzar confetti inmediatamente al cargar
      this.throwConfetti();

      // Establecer un intervalo para lanzar confetti cada 5 segundos
      this.confettiInterval = setInterval(this.throwConfetti, 3000);
    },
    throwConfetti() {
      confetti({
        particleCount: 75, // La mitad de la cantidad, ya que estamos dividiendo el confeti entre dos lados
        spread: 55,
        angle: 60, // Ángulo oblicuo hacia arriba
        origin: { x: 0.25, y: 0.8 }, // Lanzar desde el lado izquierdo del viewport
      });

      confetti({
        particleCount: 100, // Podemos tener más partículas desde el centro
        spread: 90, // Una dispersión más amplia para que parezca que está "explotando" desde el centro
        angle: 90, // Directamente hacia arriba
        origin: { x: 0.5, y: 0.95 }, // Desde el centro del viewport
      });
      // Confetti desde el lado derecho
      confetti({
        particleCount: 75,
        spread: 55,
        angle: 120, // Ángulo oblicuo hacia arriba desde el lado derecho
        origin: { x: 0.75, y: 0.8 }, // Lanzar desde el lado derecho del viewport
      });
    },
    goToIndex() {
      this.$router.push("/");
    },
  },
};
</script>

<style scoped>
.score-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 97vh;
}

.trophy-icon i {
  font-size: 4rem;
  color: gold;
  margin-bottom: 20px;
}

h2 {
  font-size: 1.5rem;
  margin-bottom: 30px;
}

.button-group {
  display: flex;
  gap: 20px;
}

.play-again {
  background-color: black;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
}

.share {
  background-color: white;
  color: black;
  padding: 10px 20px;
  border: 1px solid black;
  cursor: pointer;
}

.play-again:hover {
  background-color: gray;
}

.share:hover {
  background-color: #f0f0f0;
}
</style>
