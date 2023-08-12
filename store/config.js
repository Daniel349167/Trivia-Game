// store/config.js
export const state = () => ({
    numberOfQuestions: 5,
    apiUrl: 'https://opentdb.com/api.php',

  })
  
  export const getters = {
    numberOfQuestions: (state) => state.numberOfQuestions,
    apiUrl: (state) => state.apiUrl,

  }
  