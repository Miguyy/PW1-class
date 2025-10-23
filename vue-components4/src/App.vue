<template>
  <div>
    <RatingStars />
  </div>
</template>

<script>
import RatingStars from './components/RatingStars.vue'
export default {
  name: 'App',
  components: {
    RatingStars,
  },
  methods: {
    ratingChanged(event) {
      console.log('New rating is: ' + event)
    },
  },
}
</script>

<style lang="scss" scoped></style>
