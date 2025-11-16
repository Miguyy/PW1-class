<template>
  <div>
    <h1>{{ serie.title }}</h1>
    <img :src="serie.cover" :alt="serie.title" />
    <p>Years: {{ serie.years }}</p>
    <p>Seasons: {{ serie.seasons }}</p>
    <a :href="serie.link" target="_blank">More info</a>
    <p>
      <router-link to="/catalog">Back to Catalog</router-link>
    </p>
  </div>
</template>

<script>
import { useSeriesStore } from '../stores/series.js'
export default {
  data() {
    return {
      store: useSeriesStore(),
      serie: {},
    }
  },
  mounted() {
    this.serie = this.series.find((s) => s.id === parseInt(this.$route.params.id)) || {}
  },
}
</script>

<style lang="scss" scoped></style>
