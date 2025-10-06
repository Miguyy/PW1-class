<template>
  <div>
    <h2>Peso: {{ weight }} kgs</h2>
  </div>
</template>

<script>
export default {
  name: 'ExerciseThree',
  data() {
    return {
      weight: 72,
    }
  },
  created() {
    console.log(`created ${this.weight}`)
  },
}
</script>

<style lang="scss" scoped></style>
