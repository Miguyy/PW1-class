<script setup></script>

<template>
  <nav>
    <router-link to="/">Home</router-link> |

    <router-link to="/articles">Articles</router-link> |
    <router-link to="/articles/list">ArticleList</router-link> |
  </nav>
  <main>
    <router-view />
  </main>
</template>

<style scoped></style>
