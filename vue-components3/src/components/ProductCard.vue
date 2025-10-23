<template>
  <div>
    <h2>{{ product.name }}</h2>
    <img :src="product.image" :alt="product.name" />
    <p>Price: ${{ product.price.toFixed(2) }}</p>
    <p v-if="product.inStock">In Stock</p>
    <p v-else>Out of Stock</p>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  props: {
    product: {
      type: Object,
      required: true,
      validator(value) {
        return (
          typeof value.name === String &&
          typeof value.price === Number &&
          typeof value.image === URL &&
          typeof value.inStock === Boolean
        )
      },
    },
  },
}
</script>

<style lang="scss" scoped></style>
