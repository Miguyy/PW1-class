<template>
  <div>
    <h1>Add Series</h1>
    <form action="" @submit.prevent="addSerie">
      <label for="title">Title:</label>
      <input type="text" id="title" name="title" v-model="title" />
      <br />
      <label for="link">Link:</label>
      <input type="text" id="link" name="link" v-model="link" />
      <br />
      <label for="seasons">Seasons:</label>
      <input type="number" id="seasons" name="seasons" v-model="seasons" />
      <br />
      <label for="years">Years:</label>
      <input type="text" id="years" name="years" v-model="years" />
      <br />
      <label for="cover">Cover URL:</label>
      <input type="text" id="cover" name="cover" v-model="cover" />
      <br />
      <button type="submit">Add Series</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: '',
      link: '',
      seasons: null,
      years: '',
      cover: '',
    }
  },
  addSerie() {
    const newSerie = {
      id: Date.now(),
      title: this.title,
      link: this.link,
      seasons: this.seasons,
      years: this.years,
      cover: this.cover,
    }
    const series = JSON.parse(localStorage.getItem('series')) || []
    series.push(newSerie)
    localStorage.setItem('series', JSON.stringify(series))
    this.$router.push({ name: 'series-catalog' })
  },
}
</script>

<style lang="scss" scoped></style>
