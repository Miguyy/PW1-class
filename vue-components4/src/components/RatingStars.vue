<template>
  <div>
    <form action="">
      <select name="starsrating" id="" @change="$emit('rating-changed', $event.target.value)">
        <option value="1">1 Star</option>
        <option value="2">2 Stars</option>
        <option value="3">3 Stars</option>
        <option value="4">4 Stars</option>
        <option value="5">5 Stars</option>
      </select>
    </form>
  </div>
</template>

<script>
export default {
  name: 'RatingStars',
}
</script>

<style lang="scss" scoped></style>
