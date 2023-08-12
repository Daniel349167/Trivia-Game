<template>
  <div>
    <div class="score-box">Score: {{ puntuacion }}</div>
    <div class="trivia-container" v-if="currentQuestion">
      <div class="timer-bar-wrapper" :class="{ 'border-red': timeUp }">
        <div
          class="timer-bar"
          :class="[timerClass, { 'time-up': timeUp }]"
          :style="{ width: timerWidth + '%' }"
        >
          {{ remainingTime }}s
        </div>
        <div v-if="timeUp" class="time-up-message">
          <i class="fa-regular fa-clock"></i> Time's Up
        </div>
      </div>

      <div class="category">Category: {{ currentQuestion.category }}</div>
      <h2 class="question-title">
        Pregunta {{ currentQuestionIndex + 1 }}: {{ currentQuestion.question }}
      </h2>
      <div class="answers">
        <div
          v-for="(answer, index) in allAnswers"
          :key="index"
          class="answer-box"
          :class="{
            selected: selectedAnswer === answer,
            clicked: selectedAnswer,
          }"
          @click="selectAnswer(answer)"
        >
          {{ answer }}
        </div>
      </div>
      <div class="button-container">
        <button
          @click="confirmOrProceed"
          class="confirm-button"
          :class="buttonClass"
        >
          {{ buttonLabel }}
          <i v-if="showConfirmIcon"></i>
          <i v-else class="fa fa-arrow-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      questions: [],
      currentQuestionIndex: 0,
      selectedAnswer: null,
      remainingTime: 10,
      timerWidth: 100,
      puntuacion: 0,
      answeredInTime: false,
      interval: null,
      showConfirmIcon: true,
      buttonLabel: "Confirm Answer",
      timeUp: false,
    };
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentQuestionIndex];
    },
    allAnswers() {
      // Randomize answers
      return [
        this.currentQuestion.correct_answer,
        ...this.currentQuestion.incorrect_answers,
      ].sort(() => Math.random() - 0.5);
    },
    buttonClass() {
      return this.showConfirmIcon ? "confirm" : "next";
    },
    timerClass() {
      if (this.remainingTime <= 10 && this.remainingTime >= 6) {
        return "green";
      } else if (this.remainingTime <= 5 && this.remainingTime >= 2) {
        return "yellow";
      } else if (this.remainingTime <= 1 && this.remainingTime >= 0) {
        return "red";
      }
      return ""; // valor por defecto
    },
  },

  mounted() {
    if (this.$route.query.questions) {
      this.questions = JSON.parse(this.$route.query.questions);
    }

    this.interval = setInterval(this.decrementTimer, 1000);
  },

  methods: {
    selectAnswer(answer) {
      this.selectedAnswer = answer;
      this.answeredInTime = true;

      // Usar el $nextTick de Vue para asegurarse de que las actualizaciones al DOM han sido realizadas
      this.$nextTick(() => {
        const clickedAnswers = document.querySelectorAll(".answer-box.clicked");
        clickedAnswers.forEach((el) => {
          if (el.textContent.trim() !== answer) {
            el.classList.remove("clicked");
          }
        });
      });
    },

    confirmOrProceed() {
      if (this.showConfirmIcon) {
        this.confirmAnswer();
        clearInterval(this.interval);
        this.showConfirmIcon = false;
        this.buttonLabel = "Next";
      } else {
        this.proceedToNextQuestion();
      }
    },
    confirmAnswer() {
      clearInterval(this.interval);
      const correct =
        this.answeredInTime &&
        this.selectedAnswer === this.currentQuestion.correct_answer;
      this.$nextTick(() => {
        const selectedBox = document.querySelector(".answer-box.selected");
        if (selectedBox) {
          if (correct) {
            selectedBox.classList.add("correct");
          } else {
            selectedBox.classList.add("incorrect");
          }
        }
      });

      if (correct) {
        this.puntuacion += 5;
      }
      this.answeredInTime = false;

      if (!this.answeredInTime) {
        this.showConfirmIcon = false;
        this.buttonLabel = "Next";
      }
    },

    proceedToNextQuestion() {
      this.selectedAnswer = null;
      this.remainingTime = 10;
      this.timerWidth = 100;
      this.timeUp = false;
      this.startTimer();
      this.showConfirmIcon = true;
      this.buttonLabel = "Confirmar Respuesta";
      if (this.currentQuestionIndex < this.questions.length - 1) {
        this.currentQuestionIndex += 1;
      } else {
        // Redirecciona al jugador a la vista de puntuación
        this.$router.push({
          path: "/score",
          query: { score: this.puntuacion },
        });
      }
    },

    decrementTimer() {
      if (this.timerWidth <= 0) {
        clearInterval(this.interval); // detener el intervalo inmediatamente

        this.timerWidth = 0;
        this.remainingTime = 0;
        this.timeUp = true;
        this.answeredInTime = false;
        this.showConfirmIcon = false;
        this.buttonLabel = "Next";
        return;
      }

      const decrementValue = 10;
      this.timerWidth -= decrementValue;
      this.remainingTime = 10 - Math.floor((100 - this.timerWidth) / 11.1);
    },

    startTimer() {
      clearInterval(this.interval);
      this.interval = setInterval(this.decrementTimer, 1000);
    },
  },
};
</script>

<style scoped>
.trivia-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

.timer-bar.green {
  background-color: #4caf50 !important;
}

.timer-bar-wrapper {
  position: relative;
  height: 20px; /* La misma altura que .timer-bar */
  background-color: white;
  margin-bottom: 20px;
  border-radius: 2px; /* Esto dará esquinas redondeadas. Ajusta el valor según tus preferencias. */
  overflow: hidden; /* Asegura que el contenido interno no sobresalga las esquinas redondeadas. */
}

.timer-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%; /* Asegura que tenga la altura completa del wrapper */
  z-index: 1; /* Para que la barra esté debajo del mensaje */
  transition: width 1s linear;
}

.border-red {
  border: 0.5px solid white; /* Ajusta el grosor y estilo del borde según lo prefieras */
}

.time-up-message {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: white;
  text-align: center;
  width: 100%;
  pointer-events: none;
  z-index: 2;
}

.category {
  font-size: 18px;
  margin-bottom: 20px;
}
.question {
  font-weight: bold;
  margin-bottom: 20px;
}
.answers {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.answer-box {
  width: calc(50% - 10px);
  padding: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  margin: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
  border-radius: 10px; /* Esta línea hace que los cuadrados sean un poco redondeados */
}

.answer-box.selected {
  background-color: black;
  color: white;
}

.answer-box:hover:not(.clicked) {
  background-color: #f0f0f0; /* Color de fondo cuando el mouse pasa por encima */
}

.score-box {
  position: fixed; /* Posicionamiento fijo para que se quede en su lugar al hacer scroll */
  top: 20px;
  right: 220px;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
}

.button-container {
  position: fixed; /* Posicionamiento fijo para que se quede en su lugar al hacer scroll */
  bottom: 50px;
  right: 220px;
}

.confirm-button {
  padding: 10px 20px;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.confirm-button.confirm {
  background-color: #0056b3;
}

.confirm-button:hover {
  background-color: #4caf50;
}

.confirm-button.next {
  background-color: #0056b3;
}

.confirm-button.next:hover {
  background-color: #007bff; /* azul oscuro al pasar el ratón por encima */
}

.answer-box.selected.correct {
  background-color: green;
  color: white;
  position: relative;
}
.answer-box.selected.incorrect {
  background-color: red;
  color: white;
  position: relative;
}

.answer-box.correct::after {
  content: "\2713"; /* Check mark */
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.answer-box.incorrect::after {
  content: "\2717"; /* Cross mark */
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.timer-bar.time-up {
  background-color: red; /* Cambia el color de fondo de la barra a rojo cuando el tiempo se agote */
}

.time-up-message {
  font-size: 14px;
  color: red;
  margin-bottom: 10px;
  text-align: center;
}

.timer-bar.green {
  background-color: green;
}

.timer-bar.yellow {
  background-color: yellow;
}

.timer-bar.red {
  background-color: red;
}

.question-title {
  font-size: 20px;
  margin-bottom: 20px;
}

.time-up-message .fa-clock {
  margin-right: 5px;
}
</style>
