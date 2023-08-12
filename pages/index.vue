<template>
  <div class="outer-container">
    <div class="center-container">
      <h1 class="title">TRIVIA GAME</h1>
      <Selectores
        :modelValueCategory="selectedCategory"
        :modelValueDifficulty="selectedDifficulty"
        @update:selectedCategory="selectedCategory = $event"
        @update:selectedDifficulty="selectedDifficulty = $event"
      />

      <button @click="startTrivia" class="start-button">Empezar</button>
    </div>
  </div>
</template>

<script>
import Selectores from "../components/pantallainicio/Selectores";
import axios from "axios";

export default {
  components: {
    Selectores,
  },
  data() {
    return {
      selectedCategory: 0,
      selectedDifficulty: "",
      questions: [],
    };
  },
  methods: {
    decodeHTMLEntities(text) {
      const textArea = document.createElement("textarea");
      textArea.innerHTML = text;
      return textArea.value;
    },

    async startTrivia() {
      if (!this.selectedCategory || !this.selectedDifficulty) {
        alert("Por favor selecciona una categoría y dificultad");
        return;
      }

      const API_URL = `https://opentdb.com/api.php?amount=10&category=${this.selectedCategory}&difficulty=${this.selectedDifficulty}&type=multiple`;

      try {
        const response = await axios.get(API_URL);
        this.questions = response.data.results;

        this.questions.forEach((question) => {
          question.question = this.decodeHTMLEntities(question.question);
          question.correct_answer = this.decodeHTMLEntities(
            question.correct_answer
          );
          question.incorrect_answers = question.incorrect_answers.map(
            (answer) => this.decodeHTMLEntities(answer)
          );
        });

        
          this.$router.push({
            path: "/trivia",
            query: { questions: JSON.stringify(this.questions) },
          });
        
      } catch (error) {
        console.error("Error al obtener preguntas:", error);
      }
    },
  },
};
</script>

<style scoped>
.outer-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 20vh;
  min-height: 70vh;
}

@media (max-width: 767px) {
  .outer-container {
    padding-top: 25vh;
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
  background-color: black;
  color: white;
  padding: 10px 27px;
  border: none;
  cursor: pointer;
  transition: 0.3s;
  border-radius: 5px;
}

.start-button:hover {
  opacity: 0.8;
}
</style>
