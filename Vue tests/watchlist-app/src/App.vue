<script setup></script>

<script>
export default {
  data() {
    return {
      message: 'Hello World',
      greetings: 'Sup!',
      movieName: '',
      movieList: [],
    }
  },
  methods: {
    addMovie() {
      this.movieList.push(this.movieName)
      this.movieName = ''
      console.log(this.movieList)
      /* alert('button clicked') */
    },
  },
}
</script>

<template>
  <h1>{{ message }}</h1>
  <p>
    {{ greetings }}
  </p>
  <div class="movie-list">
    <input type="text" placeholder="Movie Name" v-model="movieName" @keydown.enter="addMovie" />
    <button @click="addMovie">Add</button>
  </div>
  <h2>Movie List</h2>
  <ul aria-labelledby="movie-list">
    <li v-for="movie in movieList" :key="movie">{{ movie }}</li>
  </ul>
</template>

<style scoped>
div.movie-list {
  display: flex;
  gap: 20px;
}

h1 {
  color: red;
}
</style>
