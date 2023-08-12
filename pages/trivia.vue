<template>
  <!-- ... otros elementos ... -->
  <button @click="startTrivia" class="btn btn-primary">Empezar</button>
</template>

<script>
export default {
  // ... otras opciones ...
  methods: {
    startTrivia() {
      this.$router.push({ path: '/trivia' });
    }
  }
}
</script>
