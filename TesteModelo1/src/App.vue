<template>
  <div>
    <nav>
      <router-link to="/">Home</router-link> |
      <router-link to="/random">Random Cocktail</router-link>
    </nav>
  </div>

  <main>
    <router-view />
  </main>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss" scoped></style>
