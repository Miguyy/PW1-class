<script setup></script>

<template>
  <h1>You did it!</h1>
  <p>
    Visit <a href="https://vuejs.org/" target="_blank" rel="noopener">vuejs.org</a> to read the
    documentation
  </p>
  <div>
    {{ count }}
  </div>
  <button @click="double">double it</button>
  <p>{{ message }}</p>
  <p>{{ reverseMethod }}</p>
  <h1>Schools:</h1>
  <ul v-if="schools.length">
    <li v-for="school in schools">
      {{ school }}
    </li>
  </ul>
  <p v-else>no schools inserted</p>
</template>

<script>
export default {
  data() {
    return {
      count: 5,
      message: 'ESMAD',
      schools: ['ESMAD', 'ISEP', 'IPS', 'ESEC'],
    }
  },
  methods: {
    double() {
      return (this.count = this.count * 2)
    },
    reverseMethod() {
      return this.message.split('').reverse.join(' ')
    },
  },
  beforeCreate() {
    console.log(`beforeCreate ${this.count}`)
  },
  created() {
    console.log(`created ${this.count}`)
  },
}
</script>

<style scoped></style>
