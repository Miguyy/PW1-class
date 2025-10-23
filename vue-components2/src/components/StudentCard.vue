<template>
  <div>
    <h2>Student Card</h2>
    <p>Name: {{ name }}</p>
    <p>Student Number: {{ studentNumber }}</p>
    <p>Course: {{ course }}</p>
    <p>Year: {{ year }}</p>
  </div>
</template>

<script>
export default {
  name: 'StudentCard',
  props: {
    name: {
      type: String,
      required: true,
    },
    studentNumber: {
      type: Number,
      required: true,
      validator(value) {
        return value > 0
      },
    },
    course: {
      type: String,
      default: 'TSIW',
    },
    year: {
      type: Number,
      default: 2,
      validator(value) {
        return value >= 1 && value <= 3
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
