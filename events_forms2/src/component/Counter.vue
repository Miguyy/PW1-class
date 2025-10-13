<template>
  <div>
    <p>Number: {{ number }}</p>
    <button v-on:click="number += 1">+</button>
    <button @click="counterExtraValidation">-</button>
    <button v-on:click="number += 5">+5</button>
    <button v-on:click="number += 10">+10</button>
    <button v-on:click="number += 50">+50</button>
    <form @reset.prevent="onReset">
      <button type="reset">Reset</button>
    </form>
    <p>Press the keys "+", "-" or "R" to see what it can do</p>
  </div>
</template>

<script>
export default {
  name: 'ExerciseOne',
  data() {
    return {
      number: 0,
    }
  },
  methods: {
    increment(val) {
      this.number += val
      this.counterExtraValidation()
    },
    onReset() {
      this.number = 0
    },
    readKeyEvents() {
      window.addEventListener('keydown', (event) => {
        if (event.key === '+') {
          this.number += 1
        }
        if (event.key === '-') {
          this.number -= 1
          this.counterExtraValidation()
        }
        if (event.key === 'R' || event.key === 'r') {
          this.onReset()
        }
      })
    },
    counterExtraValidation() {
      if (this.number < 0) {
        this.number = 0
        alert('It can never be negative!!!')
      }
    },
  },
  mounted() {
    this.readKeyEvents()
  },
}
</script>

<style lang="scss" scoped></style>
