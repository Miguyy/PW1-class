<template>
  <div>Article:{{ $route.params.id }}</div>
</template>

<script>
import articles from './ArticleListView.vue'
export default {
  name: 'ArticleView',
  props: ['id'],
  computed: {
    article() {
      const id = this.id || this.$route.params.id
      return articles.find((a) => a.id === id) || null
    },
  },
}
</script>

<style lang="scss" scoped></style>
