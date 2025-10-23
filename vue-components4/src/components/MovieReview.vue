<template>
  <div>
    <RatingStars />
  </div>
</template>

<script>
import RatingStars from './RatingStars.vue'
export default {
  name: 'MovieReview',
  props: {
    title: String,
    description: String,
  },
  components: {
    RatingStars,
  },
}
</script>

<style lang="scss" scoped></style>
