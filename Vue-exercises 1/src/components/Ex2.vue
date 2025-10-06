<template>
  <div>
    <div id="intro"></div>
    <h2>First name: {{ firstName }}</h2>
    <h2>Last name: {{ lastName }}</h2>
    <h2>Age: {{ age }}</h2>
    <h2>Full name: {{ fullName() }}</h2>
  </div>
</template>

<script>
export default {
  name: 'ExerciseTwo',
  data() {
    return {
      firstName: 'Miguel',
      lastName: 'Machado',
      age: 20,
    }
  },
  methods: {
    fullName() {
      return this.firstName + ' ' + this.lastName
    },
  },
}
</script>

<style lang="scss" scoped></style>
