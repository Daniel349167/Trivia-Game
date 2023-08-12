<template>
  <div class="elemento">
    <div class="score-box">Score: {{ puntuacion }}</div>
    <div class="trivia-container" v-if="currentQuestion">
      <div
        class="timer-bar-wrapper"
        :class="[borderClass, { 'time-up': timeUp }]"
      >
        <div
          class="timer-bar"
          :class="[timerClass, { 'time-up': timeUp }, timerTextColorClass]"
          :style="{ width: timerWidth + '%' }"
        >
          {{ remainingTime > 0 ? remainingTime + "s" : "" }}
        </div>

        <div v-if="timeUp" class="time-up-message">
          <i class="fa-regular fa-clock"></i> Time's Up
        </div>
      </div>

      <div class="category">Category: {{ currentQuestion.category }}</div>
      <h2 class="question-title">
        Question {{ currentQuestionIndex + 1 }}: {{ currentQuestion.question }}
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
          :disabled="isButtonDisabled"
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
    timerTextColorClass() {
      if (this.timerClass === "yellow") {
        return "text-black";
      }
      return "text-white";
    },

    isButtonDisabled() {
      if (this.timeUp) {
        return false;
      }
      return !this.selectedAnswer;
    },
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
    borderClass() {
      if (this.remainingTime <= 10 && this.remainingTime >= 6) {
        return "border-green";
      } else if (this.remainingTime <= 5 && this.remainingTime >= 3) {
        return "border-black";
      } else if (this.remainingTime <= 2 && this.remainingTime >= 0) {
        return "border-red";
      }
      return "";
    },

    timerClass() {
      if (this.remainingTime <= 10 && this.remainingTime >= 6) {
        return "green";
      } else if (this.remainingTime <= 5 && this.remainingTime >= 3) {
        return "yellow";
      } else if (this.remainingTime <= 2 && this.remainingTime >= 0) {
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
      this.buttonLabel = "Confirm Answer";
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
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.trivia-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  margin-top: 30px;
  text-align: center;
  animation: fadeIn 0.5s;
}
.timer-bar-wrapper.border-green {
  border-color: #4caf50 !important;
}

.timer-bar-wrapper.border-black {
  border-color: black !important;
}

.timer-bar-wrapper.border-red {
  border-color: #B22222 !important;
}

.timer-bar.green {
  background-color: #4caf50 !important;
}

.timer-bar-wrapper {
  position: relative;
  height: 20px;
  background-color: white;
  margin-bottom: 20px;
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid black;
  transition: background-color 0.5s; /* añadido para suavizar el cambio de color */
}
.timer-bar-wrapper.time-up {
  background-color: #B22222;
  color: white;
}

.timer-bar {
  position: absolute;
  color: white;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1;
  transition: width 1s linear;
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
  border-radius: 10px;
  transition: background-color 0.5s, transform 0.3s;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.answer-box.selected {
  background-color: black;
  color: white;
}

.answer-box:hover:not(.clicked) {
  background-color: #f0f0f0;
  transform: scale(1.05);
}

.score-box {
  position: fixed;
  top: 20px;
  right: 220px;
  padding: 5px 10px;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 5px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.button-container {
  position: fixed;
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
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.confirm-button.confirm {
  background-color: #0056b3;
  transition: background-color 0.3s ease;
}

.confirm-button:hover {
  background-color: #0073e6;
}

.confirm-button.next {
  background-color: #0056b3;
}

.confirm-button.next:hover {
  background-color: #007bff;
}

.confirm-button:disabled {
  cursor: not-allowed;
  opacity: 0.6;
  background-color: #b3b3b3;
}

.confirm-button:disabled:hover {
  background-color: #b3b3b3;
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
  animation: shake 0.5s;
}

.answer-box.correct::after {
  content: "\2713";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.answer-box.incorrect::after {
  content: "\2717";
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}

.time-up-message {
  font-size: 14px;
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

.elemento {
  width: auto;
}
body {
  overflow-x: hidden;
}

.category {
  font-size: 18px;
  margin-bottom: 20px;
  color: #0073e6;
  transition: color 0.3s;
}

.text-black {
  color: black;
}

.text-white {
  color: white;
}

@media only screen and (max-width: 600px) {
  .elemento {
    width: 90vw;
    margin-top: 85px;
  }
  .trivia-container {
    padding: 10px;
    width: 100%;
  }

  .button-container {
    margin-bottom: 70px;
  }

  .score-box {
    margin-top: 15px !important;
  }

  .score-box,
  .button-container {
    right: 10px;
  }

  .answer-box {
    width: 100%;
    margin: 5px 0;
  }

  .question-title {
    font-size: 16px;
    text-align: center;
    padding: 0 10px;
  }

  .category {
    text-align: center;
    padding: 0 10px;
  }
}
</style>
