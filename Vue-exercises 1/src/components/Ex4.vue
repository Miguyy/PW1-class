<template>
  <div>
    <h2>Product Name: {{ productsList.productName }}</h2>
    <h2 v-html="productsList.productDesc"></h2>
    <img :src="productsList.productImage" alt="product image" />
    <h2 v-if="productsList.productPrice < 1000">Price: {{ productsList.productPrice }}</h2>
    <button @click="resetPrice">Reset Price</button>
    <button @click="availability">Available?</button>
    <button @click="buyProduct">Buy Product</button>
  </div>
</template>

<script>
export default {
  name: 'ExerciseFour',
  data() {
    return {
      productsList: {
        productName: 'Dell XPS',
        productDesc: 'Processador i7 <br> Disco SSD 256 <br> Monitor Samsung 21',
        productImage:
          'https://www.coolmatica.pt/store/284066-large_default/monitor-curvo-samsung-odyssey-g5-813cm-32-2560-x-1440-pixels-quad-hd-led-preto.jpg',
        productPrice: 1200,
        productAvailbility: true,
        productStock: 1,
      },
    }
  },
  methods: {
    resetPrice() {
      this.productsList.productPrice = 1200
    },
    availability() {
      if (this.productsList.productAvailbility) {
        alert('Available')
      } else {
        alert('Not Available')
      }
    },
    buyProduct() {
      if (this.productsList.productStock > 0) {
        this.productsList.productAvailbility--
        alert('Purchase successful!')
      } else {
        alert('Out of stock!')
      }
    },
  },
}
</script>

<style lang="scss" scoped></style>
