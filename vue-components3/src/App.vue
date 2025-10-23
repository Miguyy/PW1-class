<template>
  <div>
    <ProductCard
      v-for="product in products"
      :key="product.name"
      :price="product.price"
      :image="product.image"
      :stock="product.inStock"
    />
  </div>
</template>

<script>
import ProductCard from './components/ProductCard.vue'

export default {
  name: 'App',
  components: {
    ProductCard,
  },
  data() {
    return {
      products: [
        {
          name: 'Laptop',
          price: 999.99,
          image:
            ' https://www.lenovo.com/pt/pt/p/laptops/thinkbook/thinkbook-series/lenovo-thinkbook-14-gen-7-14-inch-intel/len101b0046?srsltid=AfmBOoqFN0No8V9tndtnMRdA0OOgAbcFV193kD_zg8lMip1HGo91lLJW',
          inStock: true,
        },
        {
          name: 'Smartphone',
          price: 499.99,
          image:
            'https://www.xiaomistore.pt/smartphones/smartphones-xiaomi?srsltid=AfmBOooi88BXF5OnnO9_Aesk3qCTTNJRsRYZO2HBgY63vAtXV4Az3anV ',
          inStock: false,
        },
        {
          name: 'Headphones',
          price: 199.99,
          image: ' https://www.sony.pt/headphones/products/wh-ch720n',
          inStock: true,
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped></style>
