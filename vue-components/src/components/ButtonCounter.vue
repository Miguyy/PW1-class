<template>
  <div>
    <button>{{ count }}</button>
  </div>
</template>

<script>
export default {
  name: 'ButtonCounter',
  data() {
    return {
      count: 0,
    }
  },
}
</script>

<style lang="scss" scoped></style>
