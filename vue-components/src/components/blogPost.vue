<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  name: 'blogPost',
  props: {
    title: {
      type: String,
      required: true,
      default: 'No title',
      validator(value) {
        return value.length > 5
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
