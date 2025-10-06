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
</template>

<script>
export default {
  data() {
    return {
      count: 5,
      message: 'ESMAD',
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
