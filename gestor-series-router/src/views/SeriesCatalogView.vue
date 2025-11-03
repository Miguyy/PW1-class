<template>
  <div>
    <h1>Catalog</h1>
    <table>
      <tr v-for="serie in series" :key="serie.id">
        <td>
          <a :href="serie.link" target="_blank">{{ serie.title }}</a>
        </td>
        <td>
          <button @click="viewSerie(serie.id)">View</button>
          <button @click="deleteSerie(serie.id)">Delete</button>
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      series: [JSON.parse(localStorage.getItem('series')) || []],
    }
  },
  methods: {
    addSeries(serie) {
      this.series.push(serie)
      localStorage.setItem('series', JSON.stringify(this.series))
    },
    viewSerie(id) {
      this.$router.push({ name: 'series-details', params: { id } })
    },
    deleteSerie(id) {
      if (confirm('Do you want to delete this series?')) {
        this.series = this.series.filter((s) => s.id !== id)
        localStorage.setItem('series', JSON.stringify(this.series))
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
